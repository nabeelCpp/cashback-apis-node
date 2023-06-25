const db = require("../../../models");
const {User} = db;
const Op = db.Sequelize.Op;
var bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require('fs');
exports.index = async (req, res) => {
    const user = {
        id: req.user.id,
        user_id: req.user.user_id,
        first_name: req.user.first_name, 
        last_name: req.user.last_name, 
        username: req.user.username, 
        email: req.user.email,
        country: req.user.country, 
        phonecode: req.user.phonecode, 
        telephone: req.user.telephone,
        acc_name: req.user.acc_name,
        bank_nm: req.user.bank_nm,
        branch_nm: req.user.branch_nm,
        ac_no: req.user.ac_no,
        swift_code: req.user.swift_code,
        bank_state: req.user.bank_state,
        image: req.user.image&&`${process.env.BASE_URL}/userpanel/images/${req.user.image}`
    }
    return res.status(200).send(user);
}

exports.update = async (req, res) => {
    let existingUser = await User.findOne({
        where: {
            [Op.or] : [
                {
                    [Op.and] : [
                        {
                            phonecode: req.body.phonecode,
                            telephone: req.body.mobile,
                        }
                    ]
                },{
                    email: req.body.email
                }
            ],
            user_id: {
                [Op.ne]: req.user.user_id
            }
        }
    });
    if(existingUser){
        if(existingUser.email == req.body.email){
            return res.status(203).send({
                message: "Email already exist."
            })
        }
        if(existingUser.telephone == req.body.mobile){
            return res.status(403).send({
                message: "Mobile phone already exist."
            });
        }
    }
    const user = req.user;
    const {first_name, last_name, email, country, phonecode, mobile} = req.body;
    user.first_name = first_name;
    user.last_name = last_name;
    user.country = country;
    user.email = email;
    user.phonecode = phonecode;
    user.telephone = mobile;
    user.save();
    return res.status(200).send({
        success: true,
        message: "Profile Updated successfully!"
    });
}

exports.updateBankInfo = async (req, res) => {
    const user = req.user;
    const {acc_name,bank_nm ,branch_nm, ac_no, swift_code, bank_state } = req.body;
    user.acc_name = acc_name;
    user.bank_nm = bank_nm;
    user.branch_nm = branch_nm;
    user.ac_no = ac_no;
    user.swift_code = swift_code;
    user.bank_state = bank_state;
    user.save();
    return res.status(200).send({
        success: true,
        message: "Bank Details Updated successfully!"
    });
}

exports.updatePassword = async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const {confirm_password, current_password} = req.body;
    var passwordIsValid = bcrypt.compareSync(
        current_password,
        user.password
    );

    // compare simple passwords
    if(!passwordIsValid){
        passwordIsValid = current_password == user.password ? true : false
    }

    if (!passwordIsValid) {
        return res.status(401).send({
            message: "Invalid Current Password!"
        });
    }

    if( bcrypt.compareSync(confirm_password,user.password) || confirm_password == user.password){
        return res.status(500).send({
            success: false,
            message: "New password must not be similar to current password. Please try another password!"
        });
    }
    
    password = bcrypt.hashSync(confirm_password, 12);
    user.password = password;
    user.save();
    return res.status(200).send({
        success: true,
        message: "Password Updated successfully!"
    })
}

exports.updateImage = async (req, res) => {
    const logosPath = `${process.env.PROJECT_DIR}/userpanel/images/`;
    const storageLogo =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, logosPath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var uploadLogo = multer({ storage : storageLogo}).single('image');
      
    uploadLogo(req,res,async (err) => {
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
                status: false,
                message: "Error uploading Logo."
            });  
        }
        let resp = await User.update({image: req.file.filename}, {
            where: {
                id: req.user.id
            }
        });
        if(resp) {
            // Delete old logo.
            if(req.user.image){
                fs.unlink(`${logosPath}${req.user.image}`, function(err) {
                    if(err && err.code == 'ENOENT') {
                        console.log("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            }
            return res.status(200).send({
                status: true,
                message: "Profile picture updated successfully!",
                image: req.file.filename&&`${process.env.BASE_URL}/userpanel/images/${req.file.filename}`
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating profile picture."
        });
    });  
}