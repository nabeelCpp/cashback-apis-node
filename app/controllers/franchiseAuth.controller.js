const db = require("../models");
const config = require("../config/auth.config");
const {Vendor} = db;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");


exports.signin = (req, res) => {
  Vendor.findOne({
    where: {
      // username: req.body.username
      email: req.body.email
    }
  })
    .then(vendor => {
      if (!vendor) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        vendor.password
      );
      if(!passwordIsValid){
        passwordIsValid = req.body.password == vendor.password ? true : false;
      }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: vendor.id, role: "vendor" }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        success: true,
        data:{
          id: vendor.id,
          username: vendor.username,
          first_name: vendor.first_name,
          last_name: vendor.last_name,
          email: vendor.email,
          name: vendor.name,
          accessToken: token
        }
      });  
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};