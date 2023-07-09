const multer = require("multer");
const db = require("../../../models");
const fs = require('fs');
// Initializing model instances 
const {Admin, User, contactDetail, levelIncomeBinary} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
const profileImagePath = `${process.env.PROJECT_DIR}/images/`;
var bcrypt = require("bcrypt");
exports.password = async (req, res) => {
    let admin = await Admin.findByPk(req.admin.id)
    var passwordIsValid = bcrypt.compareSync(
        req.body.old_password,
        // admin.password
        admin.password_bcrypt
    );
    if (!passwordIsValid) {
        return res.status(400).send({
            success: false,
            message: "Invalid Old Password!"
        });
    }
    if(req.body.new_password != req.body.c_password){
        return res.status(400).send({
            success: false,
            message: "New Password and confirm Password doesnt match!"
        });
    }
    // update password
    let password = bcrypt.hashSync(req.body.new_password, 12)
    Admin.update({
        password_bcrypt: password
    }, {
        where: {
            id: admin.id
        }
    })
    return res.send({
        success: true,
        message: "Password updated successfully!"
    })
}

exports.profileImage = async (req, res) => {
    const storage =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, profileImagePath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var upload = multer({ storage : storage}).single('image');   
    upload(req,res,async (err) => {
        if(!req.file){
            return res.status(403).send({
                message: "No file selected."
            })
        }else if(req.file.mimetype){
            const arr = req.file.mimetype.split('/');
            if(arr[0] !== 'image'){
                return res.status(203).send({
                    success: false,
                    message: 'Invalid filetype. Only images are allowed'
                });
            }
        }
        if(err) {
            return res.status(500).send({
                success: false,
                message: "Error uploading Profile Picture."
            });  
        }
        let resp = await Admin.update({image: req.file.filename}, {
            where: {
                id: req.admin.id
            }
        });
        if(resp) {
            // Delete old logo.
            if(req.admin.image){
                fs.unlink(`${profileImagePath}${req.admin.image}`, function(err) {
                    if(err && err.code == 'ENOENT') {
                        console.log("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            }
            let admin = await Admin.findByPk(req.admin.id);
            admin = admin.getValues();
            let image = admin.image?`${process.env.BASE_URL}/images/${admin.image}`:'';
            return res.status(200).send({
                success: true,
                message: "Profile picture updated successfully!",
                image: image
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating profile picture."
        });
    });  
}

exports.policyContent = async (req, res) => {
    let id = req.params?.id;
    let content = !id ? await contactDetail.findAll() : await contactDetail.findByPk(id)
    return res.send(content)
}

exports.updatePolicyContent = async (req, res) => {
    let id = req.params?.id;
    if(id){
        contactDetail.update({
            description: req.body.content
        }, {
            where: {
                id: id
            }
        })
        return res.send({
            success: true,
            message: "Policy content updated successfully!"
        })
    }
    return res.status(400).send({
        success: false,
        message: "Invalid id"
    })
}

exports.blockManagement = async (req, res) => {
    let user_id = req.params.user_id
    let body = req.body
    let user = await User.findOne({
        where: {
            [Op.or]: [
                {user_id: user_id},
                {username: user_id},
            ]
        }
    })
    if(user) {
        if(body.down == 'with_downline'){
            let incomes = await levelIncomeBinary.findAll({
                income_id: user.user_id
            })
            incomes.forEach(async (i) => {
                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: i.down_id
                    }
                })

                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: user_id
                    }
                })
            });
        }else {
            User.update({
                user_status: body.block_status
            }, {
                where: {
                    user_id: user.user_id
                }
            })
        }

        if(body.member_type == 'left'){
            let leftMembers = await levelIncomeBinary.findAll({
                where: {
                    income_id: user.user_id,
                    leg: 'left'
                }
            })
            leftMembers.forEach(async (i) => {
                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: i.down_id
                    }
                })

                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: user_id
                    }
                })
            });
        }

        if(body.member_type == 'right'){
            let rightMembers = await levelIncomeBinary.findAll({
                where: {
                    income_id: user.user_id,
                    leg: 'right'
                }
            })
            rightMembers.forEach(async (i) => {
                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: i.down_id
                    }
                })

                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: user_id
                    }
                })
            });
        }

        if(body.member_type == 'both'){
            let bothMembers = await levelIncomeBinary.findAll({
                where: {
                    income_id: user.user_id,
                    // leg: 'right'
                }
            })
            bothMembers.forEach(async (i) => {
                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: i.down_id
                    }
                })

                User.update({
                    user_status: body.block_status
                }, {
                    where: {
                        user_id: user_id
                    }
                })
            });
        }

        return res.status(200).send({
            success: true,
            message: "User blocked status updated successfully!"
        })
    }
    return res.status(400).send({
        success: false,
        message: "Invalid user"
    })
}

exports.userWithdrawBlock = async (req, res) => {
    let user_id = req.params.user_id
    let body = req.body
    let user = await User.findOne({
        where: {
            [Op.or]: [
                {user_id: user_id},
                {username: user_id},
            ]
        }
    })
    if(user) {
        User.update({
            withdraw_status: body.block_status
        }, {
            where: {
                user_id: user_id
            }
        })
        return res.status(200).send({
            success: true,
            message: "Withdrawal Request Blocked Status Updated Successfully.."
        })
    }
    return res.status(400).send({
        success: false,
        message: "Invalid user"
    })
}

exports.getProfile = async (req, res) => {
    req.admin.image = process.env.BASE_URL+'/images/'+req.admin.image
    return res.send(req.admin)
}