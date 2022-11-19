const { restart } = require("nodemon");
var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
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
    res.send("Criado!");
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

  // UPDATING USER
  async edit(req, res) {
    var { id, name, email, role } = req.body;
    var result = await User.update(id, name, email, role);

    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Atualizado!");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Ocorreu um erro no servidor");
    }
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

  // CREATING A PASSWORD RECOVER TOKEN
  async recoverPassword(req, res) {
    var email = req.body.email;

    var result = await PasswordToken.create(email);

    if (result) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  // CHANGING PASSWORD
  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("Senha alterada!");
    } else {
      res.status(406);
      res.send("Token inválido!");
    }
  }
}

module.exports = new UserController();
