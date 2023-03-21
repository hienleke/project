const websocket = require("ws");
const net = require("net");
const short = require("short-uuid");

class User {
  constructor(type, socket) {
    this.id = short.generate();
    this.type = type;
    this.socket = socket;
    this.room = [];
  }

  getId() {
    return this.id;
  }

  removeRoom(roomID) {
    let index = this.getRoom_index(roomID);
    if (index > -1) this.room.splice(index, 1);
  }

  getRoom_index(roomID) {
    return this.room.indexOf(roomID);
  }
  addRoom(roomID) {
    if (this.getRoom_index(roomID) < 0) {
      this.room.push(roomID);
      return true;
    }
    return false;
  }
  sendData(data) {
    if (this.type == Socket_Type.WS) this.socket.send(data);
    if (this.type == Socket_Type.Net) this.socket.write(data);
  }
}

const Socket_Type = Object.freeze({
  Net: typeof net,
  WS: typeof websocket,
});

module.exports = { Socket_Type, User };
