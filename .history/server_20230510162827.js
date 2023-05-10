const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");

const PORT = 3000;

// coleção de objetos
let objects = [];

// define a rota para o arquivo index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// define a rota para o arquivo client.js
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/public/client.js');
});

// define a rota para o arquivo style.css
app.get('/style.css', function (req, res) {
    res.type('text/css');
    res.sendFile(__dirname + '/public/style/style.css');
});

// define a rota para o arquivo favicon.ico
app.get('/favicon.ico', function (req, res) {
    res.sendFile(__dirname + '/public/favicon.ico');
});

// função para enviar a lista de objetos para todos os clientes
function sendObjectsList() {
  io.emit("objectsList", objects);
}

// função para criar um novo objeto
function createObject() {
  const newObject = {
    id: objects.length,
    status: "Inativo"
  };
  objects.push(newObject);
  sendObjectsList();
}

// função para alterar o status de um objeto
function changeStatus(objectId) {
  const object = objects.find(obj => obj.id == objectId);
  if (object) {
    object.status = (object.status == "Ativo") ? "Inativo" : "Ativo";
    sendObjectsList();
  }
}

// função para excluir um objeto
function deleteObject(objectId) {
  objects = objects.filter(obj => obj.id != objectId);
  sendObjectsList();
}

// evento de conexão do socket.io
io.on("connection", (socket) => {
  // envia a lista de objetos ao cliente quando ele se conecta
  socket.emit("objectsList", objects);

  // cria um novo objeto quando o cliente emite o evento "createObject"
  socket.on("createObject", () => {
    createObject();
  });

  // altera o status do objeto quando o cliente emite o evento "changeStatus"
  socket.on("changeStatus", (objectId) => {
    changeStatus(objectId);
  });

  // exclui o objeto quando o cliente emite o evento "deleteObject"
  socket.on("deleteObject", (objectId) => {
    deleteObject(objectId);
  });

  // cliente conectado ao servidor: visto do lado do servidor
  console.log("Cliente conectado!");
  
  // cliente foi desconectado do servidor: visto do lado do servidor
  socket.on("disconnect", () => {
    console.log("Cliente desconectado!");
  });
});

// função para salvar/atualizar o arquivo objetos.json
function saveObjects() {
  
  fs.writeFile('objetos.json', JSON.stringify(objects), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  
  fs.writeFile("objetos.json", json, (err) => {
    if (err) {
      console.error("Erro ao atualizar o arquivo objetos.json:", err);
    } else {
      console.log("Arquivo objetos.json atualizado com sucesso.");
    }

}

// inicia o servidor na porta PORT (3000)
http.listen(PORT, () => {

  if (fs.existsSync("objetos.json")) {
    const data = fs.readFileSync("objetos.json");
    objects = JSON.parse(data);
  }

  console.log(`Servidor rodando na porta ${PORT}`);
});

// sempre que o objeto objects for alterado, chamamos a função saveObjects
objects.push({ newObject: 'newValue' });
saveObjects();