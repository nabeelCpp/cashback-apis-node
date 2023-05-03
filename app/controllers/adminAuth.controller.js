const db = require("../models");
const config = require("../config/auth.config");
const md5 = require("md5");
const {Admin} = db;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


exports.signin = (req, res) => {
  Admin.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(404).send({ message: "User Not found." });
      }
      
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        admin.password
      );
      
      // cdf150f6726f8f39eb2942e936939689bfa9bf0480e6150c760d257f7951dadd
      // $2b$12$JDdUien9gpx/TTRuXT3AqOrwbWV.1mw5BQaAtG0m1klnPuTE1cK76
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: admin.id, role: "admin" }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        success: true,
        data:{
          id: admin.id,
          username: admin.username,
          email: admin.email,
          name: admin.name,
          accessToken: token
        }
      });  
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};