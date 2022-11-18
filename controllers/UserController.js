var User = require("../models/User");
class UserController {
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ error: "O e-mail é invalido!" });
      return;
    }

    var emailExist = await User.findEmail(email);

    if (emailExist) {
      res.status(406);
      res.json({ err: "o e-mail já está cadastrado!" });
      return;
    }

    await User.new(email, password, name);

    res.status(200);
    res.send("Tudo ok!");
  }
}

module.exports = new UserController();
