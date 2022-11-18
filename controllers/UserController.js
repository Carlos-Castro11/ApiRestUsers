const { restart } = require("nodemon");
var User = require("../models/User");
class UserController {
  // CREATE USER
  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ error: "O e-mail é invalido!" });
      return;
    }

    var emailExist = await User.findEmail(email); // EMAIL VERIFICATION

    if (emailExist) {
      res.status(406);
      res.json({ err: "o e-mail já está cadastrado!" });
      return;
    }

    await User.new(email, password, name);

    res.status(200);
    res.send("Tudo ok!");
  }

  // GETTING ALL USERS
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  // GETTING A SPECIFIC USER
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

  // UPDATING USER
  async edit(req, res) {
    var { id, name, email, role } = req.body;
    var result = await User.update(id, name, email, role);

    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Tudo certo!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor");
    }
  }

  // DELETE USER
  async remove(req, res) {
    var id = req.params.id;

    var result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("Apagado!");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }
}

module.exports = new UserController();
