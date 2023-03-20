const { v4: uuidv4 } = require("uuid");
class User {
  uuid = uuidv4();
}

module.exports = User;
