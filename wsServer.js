const websocket = require("ws");
const net = require("net");

const user = require("./User");
const User = user.User;
const Socket_Type = user.Socket_Type;

//init
let clients = [];

////////////////////////////-------------------------//////////////////////////
////////websocketServer
const wss_server = new websocket.WebSocketServer({ port: 8080 });

console.log(" server ws run at port : ", wss_server.address().port);
wss_server.on("connection", (ws) => {
  let user = new User(Socket_Type.WS, ws);
  clients.push(user);
  user.sendData("your ID : \n " + user.id);
  ws.on("message", (message) => {
    let messag = JSON.parse(message);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.chatRoom;
      chatRoom(room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.chat1vs1;
      chat1vs1(des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;
      user.addRoom(roomId);
      user.sendData(`client ${user.getId()}  \n joined room : ${roomId}  `);
    }
    if (messag.leaveRoom) {
      let roomId = messag.joinRoom;
      user.removeRoom(roomId);
      user.sendData(`client ${user.getId()}  \n left room : ${roomId}  `);
    }
    if (messag.getlist) {
      user.sendData(
        ` list id user ${getlistIDuser()}  \n list room : ${room}  `
      );
    }
    if (messag.getmyself) {
      console.log(
        `count clients wss ${wss_clients.length} clients net  ${net_clients.length} `
      );
      user.sendData(`id user ${user.getId()} \n list room : ${user.room}  `);
    }
  });
  ws.on("close", () => {
    var index = clients.indexOf(user);
    if (index != -1) {
      clients.splice(index, 1);
    }
  });
});

//////////////////////////////////--------------------///////////////////////////
//////////////////// Net Server

var Net_server = net.createServer(function (ws) {
  let user = new User(Socket_Type.Net, ws);
  clients.push(user);
  user.sendData("your ID : \n " + user.id);
  ws.on("data", (message) => {
    let messag = JSON.parse(message);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.chatRoom;
      chatRoom(room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.chat1vs1;
      chat1vs1(des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;
      if (user.addRoom(roomId))
        user.sendData(`client ${user.getId()}  \n joined room : ${roomId}  `);
    }

    if (messag.leaveRoom) {
      let roomId = messag.leaveRoom;
      user.removeRoom(roomId);
      user.write(`client ${user.getId()}  \n left room : ${roomId}  `);
    }
    if (messag.getlist) {
      ws.write(` list id user ${getlistIDuser()}  \n list room : ${room}  `);
    }
    if (messag.getmyself) {
      ws.write(`id user ${user.getId()} \n list room : ${user.room}  `);
    }
  });

  ws.on("end", () => {
    var index = clients.indexOf(user);
    if (index != -1) {
      clients.splice(index, 1);
    }
  });
});
Net_server.listen(8081, () => {
  console.log(" server net run at port : ", Net_server.address().port);
});

// //////////////////Send Time every 1 second//////////////////////
// setInterval(() => {
//   WorldClock();
// }, 1000);

function WorldClock() {
  clients.forEach((client) => {
    client.sendData(new Date().toISOString() + "\n");
  });
}

function chatRoom(room, message) {
  clients.forEach((client) => {
    if (client.getRoom_index(room) > -1) {
      client.sendData(`from ${room} user ${client.id}:   ${message} \n `);
    }
  });
}
function chat1vs1(destination, message) {
  clients.forEach((client) => {
    if (client.getId() == destination) {
      client.sendData(`from ${client.id} :   ${message}`);
    }
  });
}

function getlistIDuser() {
  return clients.map((iteam) => iteam.id);
}
