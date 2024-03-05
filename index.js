const express = require("express");
const uuid = require("uuid");
const cors = require ('cors')

const port = 3001;
const app = express();
app.use(express.json());
app.use(cors())

const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ message: "user not found" });
  }

  request.userIndex = index;

  next();
};

const checkUrlMethod = (request, response, next) => {
  const url = request.url; // Aqui conseguimos fazer um pedido das infos da nossa URl
  const method = request.method; // Aaui pegamos o tipo de método da nossa URL

  console.log(url);
  console.log(method);

  next();
};

app.get("/order", checkUrlMethod, (request, response) => {
  return response.json(users);
});

app.get("/order/:id", checkUrlMethod, checkUserId, (request, response) => {
  const { clienteName, status, order, price } = request.body;
  const index = request.userIndex;
  const OrderUser = { id, clienteName, status, order, price };

  return response.json(OrderUser);
});

app.post("/order", checkUrlMethod, (request, response) => {
  const { clienteName, status, order, price } = request.body;

  console.log(uuid.v4());
  const user = { id: uuid.v4(), clienteName, status, price, order };

  users.push(user);
  return response.status(201).json(user);
});

app.put("/order/:id", checkUrlMethod, checkUserId, (request, response) => {
  const { id } = request.params; // Aqui pegamos o ID do usuário que queremos atualizar
  const { clienteName, status, order, price } = request.body; // Aqui trazemos as infos do nosso cliente
  const index = request.userIndex;

  const updatesUser = { id, clienteName, status, order, price }; // aqui criamos um usuário atualizado

  //                O Findeindex faz a iteração de usário por usuário, tipo o map. Feito isso, ele retorna para nossa const a posição do usuário
  // const index = users.findIndex( user => user.id === id) // Aqui nós devemos encontrar a posição do nosso cliente

  // Caso não ache o usuário, o programa cai aqui e manda uma mensagem de usuario nao encontrado.
  // if(index < 0){
  //   return response.status(404).json({ message: 'user not found'})
  // }

  // Users é o nosso ARRAY lá do topo, que contém os clientes, index é a posição do cliente a ser editado o seu pedido.
  users[index] = updatesUser; // Aqui o users na posição index recebe o updateUser

  return response.json(updatesUser); // Aqui retorna na tela o usuário que foi atualizado
});

app.patch("/order/:id", checkUrlMethod, (request, response) => {
  const { id } = request.params; // Aqui pegamos o ID do usuário que queremos atualizar
  const { clienteName, status, order, price } = request.body; // Aqui trazemos as infos do nosso cliente

  const updatesUser = { id, clienteName, status, order, price }; // aqui criamos um usuário atualizado

  //                O Findeindex faz a iteração de usário por usuário, tipo o map. Feito isso, ele retorna para nossa const a posição do usuário
  const index = users.findIndex((user) => user.id === id); // Aqui nós devemos encontrar a posição do nosso cliente

  // Caso não ache o usuário, o programa cai aqui e manda uma mensagem de usuario nao encontrado.
  if (index < 0) {
    return response.status(404).json({ message: "user not found" });
  }

  // Users é o nosso ARRAY lá do topo, que contém os clientes, index é a posição do cliente a ser editado o seu pedido.
  users[index] = updatesUser; // Aqui o users na posição index recebe o updateUser

  return response.json(updatesUser); // Aqui retorna na tela o usuário que foi atualizado
});

app.delete("/order/:id", checkUrlMethod, checkUserId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json(users);
});

app.listen(port, () => {
  console.log(`Server started on port 🚀 ${port}`);
});
