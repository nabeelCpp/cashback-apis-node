const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;
const Admin = db.Admin;
const Vendor = db.Vendor;

verifyToken = (req, res, next) => {
  if(!req.headers["authorization"]){
    return res.status(403).send({
      message: 'Authorization token is required'
    })
  }
  let token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if(req.role == 'admin'){
    Admin.findByPk(req.userId).then(admin => {
      if(admin){
        req.admin = admin;
       next();
       return; 
      }
      res.status(404).send({
        message: "No Admin found!"
      });
      return;
    })
  }else{
    res.status(403).send({
      message: "Require Admin Role!"
    });
    return;
  }
};


isUser = (req, res, next) => {
  if(req.role == 'user'){
    User.findByPk(req.userId).then(user => {
      if(user){
        req.user = user;
       next();
       return; 
      }
      res.status(404).send({
        message: "No user found!"
      });
      return;
    })
  }else{
    res.status(403).send({
      message: "Require User Role!"
    });
    return;
  }
};


isVendor = (req, res, next) => {
  if(req.role == 'vendor'){
    Vendor.findByPk(req.userId).then(vendor => {
      if(vendor){
        req.vendor = vendor;
       next();
       return; 
      }
      res.status(404).send({
        message: "No Vendor found!"
      });
      return;
    })
  }else{
    res.status(403).send({
      message: "Require Vendor Role!"
    });
    return;
  }
};




const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isUser: isUser,
  isVendor: isVendor,
  // isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;