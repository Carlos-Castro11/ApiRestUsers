var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const { ServerHandshake } = require("mysql2/lib/commands");
class User {
  // CREATE USER
  async new(email, password, name) {
    try {
      var hash = await bcrypt.hash(password, 10);

      await knex
        .insert({ email, password: hash, name, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }
  // EMAIL VERIFICATION
  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) return true;
      else return false;
    } catch (err) {
      console.log(err);
    }
  }
  // GETTING ALL USERS
  async findAll() {
    try {
      var result = await knex
        .select(["idusers", "name", "email", "role"])
        .table("users");
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  // GETTING A SPECIFIC USER
  async findById(id) {
    try {
      var result = await knex
        .select(["idusers", "name", "email", "role"])
        .where({ idusers: id })
        .table("users");

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  // UPDATING USER
  async update(id, name, email, role) {
    var user = await this.findById(id);

    if (user != undefined) {
      var editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          var result = await this.findEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, err: "O email já está cadastrado!" };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }
      //ATUALIZANDO DADOS
      try {
        await knex.update(editUser).where({ idusers: id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "O usuário não existe!" };
    }
  }
  // DELETE USER
  async delete(id) {
    var user = await this.findById(id);

    if (user != undefined) {
      try {
        await knex.delete().where({ idusers: id }).table("users");
        return { status: true };
      } catch (err) {
        return {
          status: false,
          err: err,
        };
      }
    } else {
      return {
        status: false,
        err: "O usuário não existe, portanto não pode ser deletado!",
      };
    }
  }
}

module.exports = new User();
