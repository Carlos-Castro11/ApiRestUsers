var User = require("../models/User");
class UserController {
  async index(req, res) {}

  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ error: "O e-mail é invalido!" });
    }

    await User.new(email, password, name);

    res.status(200);
    res.send("Tudo ok!");
  }
}

module.exports = new UserController();
