const multer = require("multer");
const db = require("../../../models");
const fs = require('fs');
const {amountDetail, Country, Vendor} = db;
const logosPath = `${process.env.PROJECT_DIR}/uploads/cmplogo/`;
const galleryPath = `${process.env.PROJECT_DIR}/uploads/`;
const galleryMaxCount = 5;
exports.index = async (req, res) => {
    const data = {};
    data.totalEarning = await amountDetail.sum('total_invoice_cv', {
        where: {
            seller_id: req.vendor.user_id
        }
    });

    let totalDownline = await amountDetail.count({
        where: {
            seller_id: req.vendor.user_id,
        }
    });
    data.allInvoices = totalDownline;
    data.dueAmount = req.vendor.due_amount;
    const creditLimit = {
        total: req.vendor.credit_limit,
        rest: req.vendor.credit_limit - req.vendor.due_amount
    }
    data.creditLimit = creditLimit;
    data.commissionPercent = req.vendor.commission_percent;
    let country = await Country.findOne({
        where: {
            nicename: req.vendor.country
        }
    });
    data.profile = {
        image: req.vendor.image?`${process.env.BASE_URL}/franchisepanel/images/${req.vendor.image}`:(req.vendor.sex?`${process.env.BASE_URL}/franchisepanel/images/${req.vendor.sex}.jpg`:`${process.env.BASE_URL}/franchisepanel/images/male.jpg`),
        first_name: req.vendor.first_name,
        last_name: req.vendor.last_name,
        username: req.vendor.username,
        state: req.vendor.state,
        city: req.vendor.city,
        country: country?country.name:null,
    }
    res.send(data)
};

exports.profile = async (req, res) => {
    req.vendor.cmp_logo = req.vendor.cmp_logo?`${process.env.BASE_URL}/uploads/cmplogo/${req.vendor.cmp_logo}`:'';
    req.vendor.file = await req.vendor.file.split(',').map(f => `${process.env.BASE_URL}/uploads/${f}`);
    return res.status(200).send(req.vendor);
}

exports.updateProfile = async (req, res) => {
    const vendor = req.vendor;
    let data = {
        company_reg_no: req.body.company_reg_no,
        first_name: req.body.first_name,
        email: req.body.email,
        address : req.body.address,
        lendmark: req.body.lendmark,
        country: req.body.country,
        state : req.body.state,
        city: req.body.city,
        phonecode: req.body.phonecode,
        telephone : req.body.telephone,
        description: req.body.description
    }
    let resp = await Vendor.update(data, {
        where: {
            id: vendor.id
        }
    });
    if(resp){
        return res.status(200).send({
            success: true,
            message: "Profile updated successfully!",
        })
    }else{
        return res.status(500).send({
            success: false,
            message: "Profile update failed" 
        });
    }
}

exports.updateBank = async (req, res) => {
    const vendor = req.vendor;
    let data = {
        acc_name : req.body.acc_name,
        ac_no : req.body.ac_no,
        bank_nm : req.body.bank_nm,
        branch_nm : req.body.branch_nm,
        swift_code : req.body.swift_code
    }
    let resp = await Vendor.update(data, {
        where: {
            id: vendor.id
        }
    });
    if(resp){
        return res.status(200).send({
            success: true,
            message: "Bank details updated successfully!",
        })
    }else{
        return res.status(500).send({
            success: false,
            message: "Bank details update failed" 
        });
    }
}

exports.updateLogo = async (req, res) => {
    const storage =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, logosPath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var upload = multer({ storage : storage}).single('cmp_logo');   
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
                message: "Error uploading Logo."
            });  
        }
        let resp = await Vendor.update({cmp_logo: req.file.filename}, {
            where: {
                id: req.vendor.id
            }
        });
        if(resp) {
            // Delete old logo.
            if(req.vendor.cmp_logo){
                fs.unlink(`${logosPath}${req.vendor.cmp_logo}`, function(err) {
                    if(err && err.code == 'ENOENT') {
                        console.log("File doesn't exist, won't remove it.");
                    } else if (err) {
                        console.error("Error occurred while trying to remove file");
                    } else {
                        console.info(`removed`);
                    }
                });
            }
            let vendor = await db.pocRegistration.findByPk(req.vendor.id);
            vendor = vendor.getValues();
            let cmp_logo = vendor.cmp_logo?`${process.env.BASE_URL}/uploads/cmplogo/${vendor.cmp_logo}`:'';
            return res.status(200).send({
                success: true,
                message: "Logo is updated successfully!",
                cmp_logo: cmp_logo
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating logo."
        });
    });  
}


exports.updateGallery = async (req, res) => {
    const storage =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, galleryPath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var upload = multer({ storage : storage}).array('gallery');   
    upload(req,res,async (err) => {
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
                success: false,
                message: "Error uploading Logo."
            });  
        }
        // Upload gallery one by one
        const galleryFiles = [];
        req.files.forEach(async (file) => {
            galleryFiles.push(file.filename);
        });
        let resp = await Vendor.update({file: galleryFiles.join(',')}, {
            where: {
                id: req.vendor.id
            }
        });
        if(resp) {
            // Delete old files.
            const oldGallery = req.vendor.file.split(',');
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
            let vendor = await db.pocRegistration.findByPk(req.vendor.id);
            vendor = vendor.getValues();
            let files = await vendor.file.split(',').map(f => `${process.env.BASE_URL}/uploads/${f}`);
            return res.status(200).send({
                success: true,
                message: "Gallery updated successfully!",
                files: files
            });  
        }
        return res.status(500).send({
            success: false,
            message: "Error while updating gallery."
        });
    });  
}

exports.termsAndConditions = async (req, res) => {
    let sql = "select * from contactdetail where id='16'";
    let [results, metadata] = await db.sequelize.query(sql);
    return res.send(results[0]);
}