const db = require("../../../models");
const {User, pocRegistration} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
const config = require("../../../config/auth.config");
var jwt = require("jsonwebtoken");
exports.memberAuth = async (req, res) => {
    let user_id = req.params.user_id
    let user = await User.findOne({
        where: {
            user_id: user_id
        }
    })
    if(!user){
        return res.status(404).send({
            success: false,
            message: "No user found"
        })
    }
    let token = jwt.sign({ id: user.id, role: "user" }, config.secret, {
    expiresIn: 86400 // 24 hours
    });
    res.status(200).send({
        success: true,
        data:{
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            image: user.image&&`${process.env.BASE_URL}/userpanel/images/${user.image}`,
            accessToken: token
        }
    });
}


exports.vendorAuth = async (req, res) => {
    let user_id = req.params.user_id
    let user = await pocRegistration.findOne({
        where: {
            user_id: user_id
        }
    })
    if(!user){
        return res.status(404).send({
            success: false,
            message: "No vendor found"
        })
    }
    let token = jwt.sign({ id: user.id, role: "vendor" }, config.secret, {
    expiresIn: 86400 // 24 hours
    });
    res.status(200).send({
        success: true,
        data:{
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            cmp_logo : user.cmp_logo&&`${process.env.BASE_URL}/uploads/cmplogo/${user.cmp_logo}`,
            accessToken: token
        }
    });
}