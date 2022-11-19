var knex = require("../database/connection");
var User = require("./User");

class PasswordToken {
  // CREATE A PASSWORD RECOVER TOKEN
  async create(email) {
    var user = await User.findByEmail(email);
    if (user != undefined) {
      try {
        var token = Date.now();
        await knex
          .insert({
            user_id: user.idusers,
            used: 0,
            token: token, // UUID
          })
          .table("passwordtokens");
        return { status: true, token: token };
      } catch (err) {
        console.log(err);
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "O -email não existe no banco de dados!" };
    }
  }

  // VALIDATING PASSWORD RECOVER TOKEN
  async validate(token) {
    try {
      var result = await knex
        .select()
        .where({ token: token })
        .table("passwordtokens");

      if (result.length > 0) {
        var tk = result[0];
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (err) {
      console.log(err);
      return { status: false };
    }
  }

  // SET USED PASSWORD RECOVER TOKEN
  async setUsed(token) {
    await knex
      .update({ used: 1 })
      .where({ token: token })
      .table("passwordtokens");
  }
}

module.exports = new PasswordToken();
