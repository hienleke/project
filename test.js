class abc {
  constructor(type, socket) {
    this.type = type;
    this.socket = socket;
    this.room = [];
  }

  check() {
    return "sdfasf";
  }
}

let a = new abc("x", "y");
console.log(a.check());
