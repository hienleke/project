const websocket = require("ws");
const net = require("net");
const { v4: uuidv4 } = require("uuid");

//-------------------------//////////////////////////
//websocketServer
const wss_server = new websocket.WebSocketServer({ port: 8080 });
let clients = [];
let room = [];

console.log(" server ws run at port : ", wss_server.address().port);
wss_server.on("connection", (ws) => {
  ws.room = [];
  ws.id = uuidv4();
  clients.push(ws);
  ws.send("your ID : \n " + ws.id);
  ws.on("message", (message) => {
    messag = JSON.parse(message);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.room;
      chatRoom(ws, room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.des;
      chat1vs1(ws, des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;
      ws.room.push(roomId);
      if (room.indexOf(roomId)) room.push(roomId);
    }
    if (messag.leaveRoom) {
      var index = ws.room.indexOf(item);
      if (index !== -1) {
        ws.room.splice(index, 1);
      }
    }
    if (messag.getlist) {
      ws.send(` list id user ${getlistIDuser()}  \n list room : ${room}  `);
    }
    if (messag.getmyself) {
      ws.send(`id user ${ws.id} \n list room : ${ws.room}  `);
    }
  });
  ws.on("close", () => console.log("Websocket Closed"));
});

////-----------------------------------------///
// net Server

var Net_server = net.createServer(function (ws) {
  ws.room = [];
  ws.id = uuidv4();
  clients.push(ws);
  ws.write("your ID : \n " + ws.id);
  ws.on("data", (message) => {
    messag = JSON.parse(message);
    console.log(" data from " + messag);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.room;
      chatRoom(ws, room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.des;
      chat1vs1(ws, des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;
      ws.room.push(roomId);
      if (room.indexOf(roomId)) room.push(roomId);
    }
    if (messag.leaveRoom) {
      var index = ws.room.indexOf(item);
      if (index !== -1) {
        ws.room.splice(index, 1);
      }
    }
    if (messag.getlist) {
      ws.write(` list id user ${getlistIDuser()}  \n list room : ${room}  `);
    }
    if (messag.getmyself) {
      console.log(" some thing hereh");
      ws.write(`id user ${ws.id} \n list room : ${ws.room}  `);
    }
  });
});
Net_server.listen(8081, () => {
  console.log(" server net run at port : ", Net_server.address().port);
});

// Send Time every 1 second
setInterval(() => {
  WorldClock();
}, 1000);

function WorldClock() {
  wss_server.clients.forEach((client) => {
    client.send(new Date().toISOString());
  });

  Net_server.getConnections().forEach((client) => {
    client.write(new Date().toISOString());
  });
}

function chatRoom(ws, room, message) {
  wss_server.clients.forEach((client) => {
    if (client.room.indexOf(room) > -1) {
      client.send(`from ${room} user ${ws.id}:   ${message}`);
    }
  });
}
function chat1vs1(ws, destination, message) {
  wss_server.clients.forEach((client) => {
    if (client.id == destination) {
      client.send(` from  ${ws.id} :   ${message}`);
    }
  });
}

function getlistIDuser() {
  let result = [];
  wss_server.clients.forEach((client) => {
    result.push(client.id);
  });

  Net_server.clients.forEach((client) => {
    result.push(client.id);
  });

  return result;
}
