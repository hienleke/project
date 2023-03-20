const websocket = require("ws");
const net = require("net");
const short = require("short-uuid");
const { log } = require("console");

////////////////////////////-------------------------//////////////////////////
//websocketServer
const wss_server = new websocket.WebSocketServer({ port: 8080 });

let wss_clients = [];
let wss_rooms = [];

console.log(" server ws run at port : ", wss_server.address().port);
wss_server.on("connection", (ws) => {
  ws.room = [];
  ws.id = short.generate();
  wss_clients.push(ws);
  ws.send("your ID : \n " + ws.id);
  ws.on("message", (message) => {
    let messag = JSON.parse(message);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.room;
      chatRoom(room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.des;
      chat1vs1(des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;
      if (ws.room.indexOf(roomId) == -1) {
        ws.room.push(roomId);
        ws.send(`client ${ws.id}  \n joined room : ${roomId}  `);
      }
      if (wss_rooms.indexOf(roomId) == -1) wss_rooms.push(roomId);
    }
    if (messag.leaveRoom) {
      let roomId = messag.leaveRoom;
      var index = ws.room.indexOf(roomId);
      if (index > -1) {
        ws.room.splice(index, 1);
        ws.send(`client ${ws.id}  \n left room : ${roomId}  `);
      }
    }
    if (messag.getlist) {
      ws.send(` list id user ${getlistIDuser()}  \n list room : ${room}  `);
    }
    if (messag.getmyself) {
      console.log(
        `count clients wss ${wss_clients.length} clients net  ${net_clients.length} `
      );
      ws.send(`id user ${ws.id} \n list room : ${ws.room}  `);
    }
  });
  ws.on("close", (client) => {
    var index = wss_clients.indexOf(client);
    if (index != -1) {
      wss_clients.splice(index, 1);
    }
  });
});

//////////////////////////////////--------------------///////////////////////////
// net Server

let net_clients = [];
let net_rooms = [];

var Net_server = net.createServer(function (ws) {
  ws.room = [];
  ws.id = short.generate();
  net_clients.push(ws);

  ws.write("your ID : \n " + ws.id);
  ws.on("data", (message) => {
    let messag = JSON.parse(message);

    if (messag.chatRoom) {
      let message = messag.message;
      let room = messag.room;
      chatRoom(room, message);
    }
    if (messag.chat1vs1) {
      let message = messag.message;
      let des = messag.des;
      chat1vs1(des, message);
    }
    if (messag.joinRoom) {
      let roomId = messag.joinRoom;

      if (net_rooms.indexOf(roomId) == -1) net_rooms.push(roomId);

      if (ws.room.indexOf(roomId) == -1) {
        ws.room.push(roomId);
        ws.write(`client ${ws.id}  \n joined room : ${roomId}  `);
      }
    }
    if (messag.leaveRoom) {
      let roomId = messag.leaveRoom;
      var index = ws.room.indexOf(roomId);
      if (index > -1) {
        ws.room.splice(index, 1);
        ws.write(`client ${ws.id}  \n left room : ${roomId}  `);
      }
    }
    if (messag.getlist) {
      ws.write(` list id user ${getlistIDuser()}  \n list room : ${room}  `);
    }
    if (messag.getmyself) {
      console.log(
        `count clients wss ${wss_clients.length} clients net  ${net_clients.length} `
      );
      ws.write(`id user ${ws.id} \n list room : ${ws.room}  `);
    }
  });

  ws.on("end", (client) => {
    var index = net_clients.indexOf(client);
    if (index != -1) {
      net_clients.splice(index, 1);
    }
  });
});
Net_server.listen(8081, () => {
  console.log(" server net run at port : ", Net_server.address().port);
});

// Send Time every 1 second
// setInterval(() => {
//   WorldClock();
// }, 1000);

function WorldClock() {
  wss_server.clients.forEach((client) => {
    client.send(new Date().toISOString() + "\n" + `size netWS    `);
  });

  net_clients.forEach((client) => {
    client.write(new Date().toISOString() + "\n");
  });
}

function chatRoom(room, message) {
  wss_clients.forEach((client) => {
    if (client.room.indexOf(room) > -1) {
      client.send(`from ${room} user ${client.id}:   ${message} \n `);
    }
  });

  net_clients.forEach((client) => {
    if (client.room.indexOf(room) > -1) {
      client.write(` from  ${room}  ${client.id} :   ${message} \n`);
    }
  });
}
function chat1vs1(destination, message) {
  wss_clients.forEach((client) => {
    if (client.id == destination) {
      client.send(` from  ${client.id} :   ${message}`);
    }
  });
  net_clients.forEach((client) => {
    if (client.id == destination) {
      client.write(` from  ${client.id} :   ${message}`);
    }
  });
}

function getlistIDuser() {
  let result = [];
  wss_clients.forEach((client) => {
    result.push(client.id);
  });

  net_clients.forEach((client) => {
    result.push(client.id);
  });

  return result;
}
