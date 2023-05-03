const db = require('../../../models');
const multer = require("multer");
const fs = require('fs');
const Op = db.Sequelize.Op;
const {pocRegistration, matrixDownline, User, amountDetail, finalEWallet, levelEWallet, statusMaintenance, lifejacketSubscription} = db;
const logosPath = `${process.env.PROJECT_DIR}/uploads/cmplogo/`;
const galleryPath = `${process.env.PROJECT_DIR}/uploads/`;
const galleryMaxCount = 5;
const publicController = require('../../public.controller');
var bcrypt = require("bcrypt");







exports.list = async (req, res) => {
    let vendors = await pocRegistration.findAll({
        where: {
            franchise_category: {
                [Op.ne]: 'Master Franchise'
            }
        },
        order: [
            ['id', 'DESC']
        ],
        attributes: ["id", "user_id", "username", "first_name", "last_name", "registration_date", "activation_date", "commission_percent", "credit_limit", "due_amount", "user_status", "file", "location"]
    });
    for (let i = 0; i < vendors.length; i++) {
        const vendor = vendors[i];
        vendor.file = await vendor.file.split(',').map(f => `${process.env.BASE_URL}/uploads/${f}`);
    }
    return res.send(vendors);
}

exports.singleList = async (req, res) => {
    let vendor = await pocRegistration.findByPk(req.params.id, {
        attributes: {exclude: ['password']},
    });
    vendor.file = await vendor.file.split(',').map(f => `${process.env.BASE_URL}/uploads/${f}`);
    return res.send(vendor);
}

exports.update = async (req, res) => {
    let body = req.body;
    let message = "";
    if(req.params.id){
        var where = {
            id: req.params.id
        }
    }else{
        var where = {
            user_id: body.user_id
        }
    }
    let checkUser = await pocRegistration.count({
        where: where
    });
    if(!checkUser){
        return res.status(404).send({
            success: false,
            message: "Vendor not found!"
        });
    }
    if(req.body.action == 'update-status'){
        try {
            pocRegistration.update({
                user_status: body.status
            },{
                where: {
                    user_id: body.user_id
                }
            });
            message = "Vendor status updated successfully!";
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }

    if(body.action == 'update-profile'){
        let id = req.params.id;
        try {
            let user = await pocRegistration.findByPk(id);
            user = user.getValues();
            if(!user){
                return res.status(404).send({
                    success: false,
                    message: "Vendor not found!"
                })
            }
            if(user.email != body.email ){
                // Check email already exists
                const checkEmail = await pocRegistration.count({
                    where: {
                        email: body.email
                    }
                });
                if(checkEmail){
                    return res.status(406).send({
                        success: false,
                        message: "Email already exists!",
                    });
                }
            }
            const editAbles = ["company_reg_no","first_name","last_name","description","email","location","lendmark","country","phonecode","telephone","city","state","commission_percent","credit_limit"]
            let updateUser = {};
            editAbles.forEach(ea => {
                updateUser[ea] = body[ea]||user[ea];
            });
            pocRegistration.update(updateUser, {
                where: {
                    id: user.id
                }
            });
            message = "Profile Information Updated Successfully!";
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }

    if(body.action == 'update-bankinfo'){
        const editAbles = ["acc_name","ac_no","bank_nm","branch_nm","swift_code"];
        try {
            let updateUser = {};
            editAbles.forEach(ea => {
                updateUser[ea] = body[ea]||user[ea];
            });
            pocRegistration.update(updateUser, {
                where: {
                    id: req.params.id
                }
            });
            message = "Bank Information Updated Successfully!";
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }

    return res.send({
        success: true,
        message: message
    });
}

exports.updateGallery = async (req, res) => {
    let user = await pocRegistration.findByPk(req.params.id);
    if(!user){
        return res.status(404).send({
            success: false,
            message: "Vendor not found!"
        });
    }
    const storageGallery =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, galleryPath);
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var uploadGallery = multer({ storage : storageGallery}).array('gallery');
       
    uploadGallery(req,res,async (err) => {
        if(req.files && req.files.length > galleryMaxCount){
            return res.status(203).send({
                success: false,
                message: `Max gallery upload limit is ${galleryMaxCount}`
            });
        }
        if(!req.files){
            return res.status(403).send({
                message: "Min 1 gallery image file is required!"
            })
        } 
        var invalidFileCollection = false;
        req.files.forEach(file => {
            if(file.mimetype){
                const arr = file.mimetype.split('/');
                if(arr[0] !== 'image'){
                    invalidFileCollection = true;
                }
            }
        });
        if(invalidFileCollection){
            return res.status(203).send({
                success: false,
                message: 'Invalid filetype. Only images are allowed'
            });
        }
        if(err) {
            return res.status(500).send({
                status: false,
                message: "Error uploading Logo."
            });  
        }
        // Upload gallery one by one
        const galleryFiles = [];
        req.files.forEach(async (file) => {
            galleryFiles.push(file.filename);
        });
        let resp = await pocRegistration.update({file: galleryFiles.join(',')}, {
            where: {
                id: req.params.id
            }
        });
        if(resp) {
            // Delete old files.
            const oldGallery = user.file.split(',');
            oldGallery.forEach(old => {
                fs.unlink(`${galleryPath}${old}`, function(err) {
                    if(err && err.code == 'ENOENT') {
                        console.log("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            })
            return res.status(200).send({
                status: true,
                message: "Gallery updated successfully!"
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating gallery."
        });
    });
}

exports.updateLogo = async (req, res) => {
    let user = await pocRegistration.findByPk(req.params.id);
    if(!user){
        return res.status(404).send({
            success: false,
            message: "Vendor not found!"
        });
    }
    const storageLogo =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, logosPath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var uploadLogo = multer({ storage : storageLogo}).single('cmp_logo');
      
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
        let resp = await pocRegistration.update({cmp_logo: req.file.filename}, {
            where: {
                id: user.id
            }
        });
        if(resp) {
            // Delete old logo.
            if(user.cmp_logo){
                fs.unlink(`${logosPath}${user.cmp_logo}`, function(err) {
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
                message: "Logo is updated successfully!"
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating logo."
        });
    });  
}

exports.create = async (req, res) => {
    let body = req.body;
    try {
        body.user_id =  await generateUserId();
        body.franchise_satus = body.franchise_category == 'Master Franchise'?1:0;
        body.t_code = await publicController.makeid(8);
        const insert = {
            'user_id':  body.user_id, 
            'username': body.username,
            'password': bcrypt.hashSync(body.password, 12),
            'first_name': body.first_name,
            'description': body.description,
            'last_name': body.lastname||'',
            'email': body.email,
            'user_status':"0",
            'registration_date': publicController.currentDateTime(),
            't_code': body.t_code,
            'location':body.location,
            'telephone':body.telephone,
            'address':body.address,
            'city':body.city,
            'sex':body.sex,
            'state':body.state,
            'country':body.country,
            'phonecode':body.phonecode,
            'lendmark':body.lendmark,
            'franchise_category':body.franchise_category,
            'franchise_satus': 1,
            'stock_point':body.stock_point||'',
            'gst':body.gst||'',
            'file':body.file||'',
            'cmp_logo':body.cmp_logo||'',
            'commission_percent':body.commission_percent, 
            'credit_limit':body.credit_limit, 
            'company_reg_no':body.company_reg_no
        };
        let vendorCreate = await pocRegistration.create(insert);
        return res.status(200).send({
            success: true,
            message: "Vendor created successfully!",
            vendor: {
                id: vendorCreate.id
            }
        });
        
    } catch (error) {
        return publicController.errorHandlingFunc(req, res, error.message);
    }
}
const generateUserId = async () => {
    let user_id = "Emark"+String(Math.floor(Math.random()*100000)).padStart(5, 0);
    const users = await pocRegistration.findAll({where: {user_id: user_id}});
    if(!users.length){
        return user_id;
    }else{
        generateUserId();
    }
}
