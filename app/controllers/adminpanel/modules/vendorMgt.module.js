const db = require('../../../models');
const multer = require("multer");
const fs = require('fs');
const Op = db.Sequelize.Op;
const {pocRegistration, matrixDownline, User, amountDetail, finalEWallet, levelEWallet, statusMaintenance, lifejacketSubscription, dueClearRequest, pucCreditDebit, creditDebit, eshopPurchaseDetail, venderServices, pocRegisterDetails} = db;
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

exports.paymentRequestReport = async (req, res) => {
    let reports = await dueClearRequest.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    let data = []
    for (let i = 0; i < reports.length; i++) {
        const r = reports[i].getValues()
        let vendor = await pocRegistration.findOne({
            where: {
                user_id: r.user_id
            }
        })
        let temp = {
            user_id: r.user_id,
            username: vendor.username,
            payment_mode : r.payment_mode,
            pay_proof: `${process.env.BASE_URL}/franchisepanel/images/${r.pay_proof}`,
            posted_date: r.posted_date,
            status: r.status
        }   
        data.push(temp)
    }
    return res.send(data)
}

exports.approvePaymentRequest = async (req, res) => {
    let status = req.params.status
    let id = req.params.id
    let dueClear = await dueClearRequest.findByPk(id)
    if(dueClear && status){
        let vendor = await pocRegistration.findOne({
            where: {
                user_id: dueClear.user_id
            },
            attributes: ['due_amount']
        })
        if(vendor.due_amount >= dueClear.amount ) {
            try {
                pocRegistration.update({
                    due_amount: db.sequelize.literal(`due_amount-${dueClear.amount}`)
                }, {
                    where: {
                        user_id: dueClear.user_id
                    }
                })
                let trasactionNo = await publicController.makeidNumeric(13)
                let invoiceNo = await publicController.makeidNumeric(5)
                pucCreditDebit.create({
                    transaction_no: trasactionNo, 
                    user_id: 'Admin', 
                    credit_amt: dueClear.amount, 
                    debit_amt: 0, 
                    admin_charge: 0, 
                    receiver_id: 'Admin', 
                    sender_id: dueClear.user_id, 
                    receive_date: new Date().toISOString().split('T')[0], 
                    ttype: 'Clear Due', 
                    TranDescription: `${dueClear.user_id} has cleared his due`, 
                    Cause: dueClear.amount, 
                    Remark: 'Clear Due', 
                    invoice_no: invoiceNo, 
                    product_name: '0', 
                    status: 0, 
                    ewallet_used_by: 'Admin Wallet',
                    ts: new Date().toISOString(),
                    current_url: '0'
                })
                creditDebit.create({
                    transaction_no: trasactionNo, 
                    user_id: dueClear.user_id, 
                    credit_amt: dueClear.amount, 
                    debit_amt: 0, 
                    admin_charge: 0, 
                    receiver_id: 123456, 
                    sender_id: dueClear.amount, 
                    receive_date: new Date().toISOString().split('T')[0], 
                    ttype: 'Payment Approved', 
                    TranDescription: 'Payment Approved From Admin', 
                    Cause: 0, 
                    Remark: 'Payment Approved',
                    invoice_no: trasactionNo, 
                    product_name: 'Payment Approved', 
                    status: 0, 
                    ewallet_used_by: 'Activation Wallet',
                    current_url: '0'
                })
    
                dueClearRequest.update({
                    status: status
                }, {
                    where: {
                        id: id
                    }
                })
                
            } catch (error) {
                return publicController.errorHandlingFunc(req, res, error.message);
            }
            return res.send({
                success: true,
                message: "Due cleared Successfully!"
            })
            
        }
    }

    return res.send({
        success: false,
        message: "Error occured while clearig request"
    })
}

exports.rejectPaymentRequest = async (req, res) => {
    let id = req.params.id
    let body = req.body
    let dueClear = await dueClearRequest.findByPk(id)
    if(dueClear){
        dueClearRequest.update({
            status: 2,
            admin_remark: body.remark||null,
            admin_date: new Date().toISOString().split('T')[0] 
        }, {
            where: {
                id: id
            }
        })
        return res.send({
            success: true,
            message: "You have successfully rejected member request"
        })
    }
    return res.send({
        success: false,
        message: "invalid id"
    })
}

exports.salesReport = async (req, res) => {
    let records = await pucCreditDebit.findAll({
        where: {
            ttype: 'Admin Commission'
        },
        group: [
            ['sender_id']
        ]
    })
    let data = []
    let totalCommision = 0
    let total = 0
    for (let i = 0; i < records.length; i++) {
        const rec = records[i].getValues()
        let causeSum = await pucCreditDebit.sum("Cause", {
            where: {
                ttype: 'Admin Commission', 
                sender_id : rec.sender_id
            }
        })

        let creditSum = await pucCreditDebit.sum("credit_amt", {
            where: {
                ttype: 'Admin Commission', 
                sender_id : rec.sender_id
            }
        })
        total += creditSum
        totalCommision += causeSum
        let vendor = await pocRegistration.findOne({
            where: {
                user_id: rec.sender_id
            }
        })
        let temp = {
            transaction_no: rec.transaction_no,
            vendor_id: rec.sender_id,
            vendor_name: vendor?.first_name+' '+vendor?.last_name,
            invoice_amount: causeSum,
            commission_percent: rec?.Remark,
            commision: creditSum,
            receive_date: rec.receive_date,
        }
        data.push(temp)
    }
    let response = {}
    response.total_sale = totalCommision
    response.total_commision = total
    response.data = data
    return res.send(response)
}


exports.salesReportSingle = async (req, res) => {
    let user_id = req.params.user_id
    let vendor = await pocRegistration.findOne({
        where: {
            user_id: user_id
        }
    })
    if(!vendor){
        return res.status(401).send({
            success: false,
            message: "Invalid vendor id"
        })
    }
    let records = await pucCreditDebit.findAll({
        where: {
            ttype: 'Admin Commission',
            sender_id: user_id,
        }
    })
    let totalCommision = 0
    let total = 0
    let data = []
    for (let i = 0; i < records.length; i++) {
        const rec = records[i].getValues()
        total += parseFloat(rec.credit_amt)
        totalCommision += parseFloat(rec.Cause)
        let temp = {
            transaction_no: rec.transaction_no,
            vendor_id: rec.sender_id,
            vendor_name: vendor?.first_name+' '+vendor?.last_name,
            invoice_amount: rec.Cause,
            commission_percent: rec?.Remark,
            commision: rec.credit_amt,
            invoice: rec.invoice_no,
            receive_date: rec.receive_date,
        }
        data.push(temp)
    }
    let response = {}
    response.total_sale = totalCommision
    response.total_commision = total
    response.data = data
    return res.send(response)
}

exports.vendorInvoices = async (req, res) => {
    let invoices = await amountDetail.findAll({
        order: [
            ['am_id', 'DESC']
        ]
    })
    let grandRevenue = 0
    let data = []
    for (let i = 0; i < invoices.length; i++) {
        const inv = invoices[i].getValues()
        let user = await User.findOne({
            where: {
                user_id: inv.user_id, 
            }
        })
        grandRevenue += parseFloat(inv.total_invoice_cv)
        let temp = {
            user_id: inv.user_id,
            username: user.username,
            invoice_no: inv.invoice_no,
            total_amount: inv.total_invoice_cv,
            date: inv.payment_date,
            vendor: inv.seller_id
        }
        data.push(temp)
    }
    let response = {}
    response.total_amount = grandRevenue
    response.data = data
    return res.send(response)
}

exports.vendorInvoice = async (req, res) => {
    let invoice_no = req.params.invoice_no
    let detail = await amountDetail.findOne({
        where: {
            invoice_no: invoice_no
        }
    })
    if(!detail){
        return res.status(401).send({
            success: false,
            message: "Invalid Invoice Number"
        })
    }
    let user = await User.findOne({
        where: {
            user_id: detail.user_id
        }
    })
    let items = await eshopPurchaseDetail.findAll({
        where: {
            invoice_no: invoice_no
        },
        attributes: ['product_name', 'net_price', 'quantity', 'price']
    })
    let response = {
        total_purchase: detail.total_amount,
        office_address: 'Cognisance Sciences',
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
            city: user.city,
            state: user.state,
            country: user.country,
            telephone: user.telephone,
        },
        invoice_no: detail.invoice_no,
        invoice_date: detail.payment_date,
        invoice_status: 'Paid',
        items: items,
        subtotal: detail.net_amount,
        grand_total: detail.total_amount


    }
    return res.send(response)
}

exports.services = async (req, res) => {
    let services = await venderServices.findAll()
    return res.send(services)
}

exports.deleteService = async (req, res) => {
    let id = req.params.id
    let service = await venderServices.findByPk(id)
    if(!service){
        return res.status(401).send({
            success: false,
            message: "Service not found"
        })
    }
    try {
        await venderServices.destroy({
            where: {
                id: id
            }
        })
    } catch (error) {
        return publicController.errorHandlingFunc(req, res, error.message);
    }
    return res.send({
        success: true,
        message: "Service deleted successfully!"
    })
}

exports.createService = async (req, res) => {
    let body = req.body
    try {
        await venderServices.create({
            service_name: body.service_name,
            date: new Date().toISOString()
        })
    } catch (error) {
        return publicController.errorHandlingFunc(req, res, error.message);
    }
    return res.send({
        success: true,
        message: "Service created successfully!"
    })
}

exports.ourVendors = async (req, res) =>  {
    let vendors = await venderServices.findAll();
    let companies = await pocRegistration.findAll({
        where: {
            franchise_category: {
                [Op.ne] : 'Master Franchise'
            }
        },
        attributes: ['file', 'user_id', 'first_name', 'last_name', 'telephone', 'address', 'id', ]
    });
    let categories = await pocRegisterDetails.findAll();
    for (let index = 0; index < companies.length; index++) {
        companies[index]['file'] = companies[index]['file'].split(',').map(f=>`${process.env.BASE_URL}/uploads/${f}`); 
        
    }
    return res.status(200).send({
        vendors: vendors,
        categories: categories,
        companies: companies
    })
}

exports.ourVendorsHistory = async (req, res) => {
    let user_id = req.params.user_id
    let details = await amountDetail.findAll({
        where: {
            seller_id: user_id
        }
    })
    let data = []
    for (let i = 0; i < details.length; i++) {
        const detail = details[i].getValues()
        let temp = {
            user_id: detail.user_id,
            seller_id: detail.seller_id,
            total_sale: detail.total_invoice_cv,
            invoice_no: detail.invoice_no,
            date: detail.date
        }
        data.push(temp)
        
    }
    return res.send(data)
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
