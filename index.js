//Importación de la libreria express.
const express = require("express");
require("dotenv").config();

//Variable de tipo express
const app = express();

//Declarar que todos los archivos que se generarán, serán de tipo json.
app.use(express.json());

//Array de consolas, solo para un ejemplo de base de datos local.
const consoles = [
  { id: 1, console: "Xbox" },
  { id: 2, console: "PlayStation" },
  { id: 3, console: "Nintendo" },
];

//COMENZAMOS CON LA API

//METODO GET

//Al entrar a la raiz de la api, mostrará un mensaje indicando que es la página principal de la api
app.get("/", (req, res) => {
  res.send("Node JS api, página principal");
});

//Al entrar al apartado de consolas, mostrará un mensaje indicando las consolas de la base de datos local.
app.get("/api/consoles", (req, res) => {
  res.send(consoles);
});
//Al entrar al apartado consolas:id, este buscará el id que nosotros le proporcionemos y se asegurará de 2 cosas: si existe o no existe.
//Al no existir, mostrará un mensaje de error y al existir, mostrará un mensaje mostrando el id del elemento solicitado.
app.get("/api/consoles/:id", (req, res) => {
  //Constante para buscar en el arreglo "consoles", que el id del arreglo sea igual al id convertido a entero que proporcioné en el URL.
  const consoleId = consoles.find((c) => c.id === parseInt(req.params.id));

  if (!consoleId) return res.status(404).send("Consola no encontrada");
  else res.send(consoleId);
});

//METODO POST

//Al entrar al apartado consoles, se activará la función para agregar una nueva consola.
app.post("/api/consoles", (req, res) => {
  //Creación de un objeto para despues ser agregado al arreglo.
  const addConsoles = {
    id: consoles.length + 1,
    console: req.body.console,
  };
  //Añadir una nueva consola al array.
  consoles.push(addConsoles);
  //Respuesta enviada.
  res.send(addConsoles);
});

//METODO PUT
app.put("/api/consoles/:id", (req, res) => {
  //Constante para guardar la id que se actualizará.
  const idToUpdate = parseInt(req.params.id);
  //Constante para guardar la información del cuerpo del array.
  const updateConsoles = req.body;

  //Constate para buscar el index del array y que sea igual al id que se actualizará.
  const indexToUpdate = consoles.findIndex(
    (console) => console.id === idToUpdate
  );

  //Si el index a actualizar es diferente estrictamente a -1, se podrá actualizar.
  if (indexToUpdate !== -1) {
    //Creación de 2 copias por referencia:
    /*Copia del id: ...consoles[indexToUpdate]
        Copia del body: ...updateConsoles
        Estas copias, toman la información del id y su body para ser reemplazadas por la información que el usuario dará.
        Esas copias formarán parte de la información original y posteriormente tomaran su lugar ya que se está igualando el array:
        consoles[indexToUpdate] a las copias por referencia.*/
    consoles[indexToUpdate] = { ...consoles[indexToUpdate], ...updateConsoles };
    //Envia un mensaje en formato json para informar al usuario que la consola ha sido actualizada.
    res.json({ message: "Consoles updated" });
  } else {
    //Manda un error cuando se inserte un id que no exista.
    res.status(404).json({ message: "Error, id doesn´t exist" });
  }
});

//METODO DELETE

app.delete("/api/consoles/:id", (req, res) => {
  const deleteConsoles = consoles.find((c) => c.id === parseInt(req.params.id));
  //Comprobar si existe una consola específica.
  if (!deleteConsoles) return res.status(404).send("Consoles not found");
  //Constante para buscar el índice de la consola seleccionada dentro del arreglo Consolas.
  const index = consoles.indexOf(deleteConsoles);
  //Eliminar una consola por el método splice.
  //Al obtener el indice en la constante anterior: index, se eliminará desde ese indice para adelante, el número "1" que está al lado, indica cuantos elementos del array eliminará, en este caso uno solo.
  consoles.splice(index, 1);
  //Mandar al servidor la información.
  res.send(deleteConsoles);
});

//Constante para guardar el puerto del servidor.
const port = process.env.PORT || 2000;
//Método listen para capturar el puerto y un método que en este caso contiene un console.log para avisar que el servidor está siendo escuchado.
app.listen(port, () => console.log("Listening on port " + port));
