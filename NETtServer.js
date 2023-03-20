const net = require("net");
var server = net.createServer();
const PORT = process.env.PORT || 3000;
server.on("connection", (socket) => {
  socket.join("rroom");
  socket.emit("message", " data");
});
server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.log("Address in use, retrying...");

    setTimeout(() => {
      server.close();
      server.listen(PORT);
    }, 1000);
  } else {
    console.log("Server failed.");
  }
});
server.listen(PORT, () => {
  console.log("opened server on %j", server.address().port);
  console.log("opened server on %j", server.address().address);
});
