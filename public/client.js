const socket = io();

let previousObjects = [];

// ouvinte de eventos para o botão "criar"
document.getElementById("criar").addEventListener("click", function() {
    const nome = document.getElementById("nome").value;
    if (nome !== "") {
      socket.emit("createObject", nome);
      // solicita a lista atualizada de objetos do servidor
      socket.emit("getObjects");
    }
    console.log("Objeto criado...");
  });

// função para criar objeto
function createObject() {
    var nome = document.getElementById("nome").value;
    socket.emit("createObject", nome);
  }

// função para alterar status do objeto
function changeStatus(objectId) {
  socket.emit("changeStatus", objectId);
}

// função para excluir objeto
function deleteObject(objectId) {
  socket.emit("deleteObject", objectId);
}

// função para atualizar lista de objetos
function updateObjectsList(objects) {
  // limpa container de objetos
  const objectsContainer = document.getElementById("objects-container");
  objectsContainer.innerHTML = "";
  // cria DIV para cada objeto e adiciona ao container
  objects.forEach((object) => {
    const objectDiv = document.createElement("div");
    objectDiv.setAttribute("class", "object");
    const objectIdSpan = document.createElement("span");
    objectIdSpan.innerHTML = `ID: ${object.id}`;
    const objectStatusSpan = document.createElement("span");
    objectStatusSpan.innerHTML = `Status: ${object.status}`;
    const objectButton = document.createElement("button");
    objectButton.setAttribute("onclick", `changeStatus(${object.id})`);
    objectButton.innerHTML = (object.status == "Ativo") ? "Desativar" : "Ativar";
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("onclick", `deleteObject(${object.id})`);
    deleteButton.innerHTML = "Excluir";
    // adiciona elementos à DIV do objeto
    objectDiv.appendChild(objectIdSpan);
    objectDiv.appendChild(objectStatusSpan);
    objectDiv.appendChild(objectButton);
    objectDiv.appendChild(deleteButton);
    // adiciona DIV do objeto ao container
    objectsContainer.appendChild(objectDiv);
  });
}

// recebe atualização da lista de objetos do servidor
socket.on("objectsList", (objects) => {
  updateObjectsList(objects);
  // inicia a monitoração de atualização de objetos
  monitorObjectsUpdate(objects); 
});

// função para monitorar a atualização de objetos
function monitorObjectsUpdate(objects) {
  setInterval(() => {
    if (JSON.stringify(objects) !== JSON.stringify(previousObjects)) {
      console.log("A variável objects foi atualizada.");
      previousObjects = objects;
    }
  }, 1000); // verifica a cada 1 segundo
}

// atualiza lista de objetos quando a página é carregada
window.onload = () => {
    socket.emit("getObjects");
  };

// cliente conectado ao servidor: visto do lado do cliente
socket.on("connect", () => {
  console.log("Conectado ao servidor!");
});

// cliente desconectado do servidor: visto do lado do cliente
socket.on("disconnect", () => {
  console.log("Desconectado do servidor!");
});
