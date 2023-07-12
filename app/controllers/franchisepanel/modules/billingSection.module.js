const { body } = require("express-validator");
const db = require("../../../models");
const {pocRegistration, amountDetail, User, Vendor, eshopPurchaseDetail, dueClearRequest, pucCreditDebit, matrixDownline, creditDebit, lifejacketSubscription} = db;
const Op = db.Sequelize.Op;
const publicController = require("../../public.controller");
const multer = require("multer");
const payDuesProofPath = `${process.env.PROJECT_DIR}/franchisepanel/images/`;

// all invoice belongs to logged in vendor
exports.invoices = async (req, res) => {
    const data = [];
    const invoices = await amountDetail.findAll({
        where: {
            seller_id: req.vendor.user_id,
            status: 0
        }
    });
    for (let index = 0; index < invoices.length; index++) {
        const temp = invoices[index].getValues();
        const user = await User.findOne({
            where: {
                user_id: temp.user_id
            }
        })
        temp.username = user.username;
        data.push(temp);
    }
    return res.status(200).send(data);
}

// view single invoice
exports.viewInvoice = async (req, res) => {
    let invoice_no = req.params.invoice_number;
    invData = await amountDetail.findOne({
        where: {
            invoice_no: invoice_no
        }
    });
    invData = invData.getValues();

    const purchaseDetail = await eshopPurchaseDetail.findAll({
        where: {
            invoice_no: invoice_no
        }
    });
    invData.purchase_detail = purchaseDetail

    const userDetails = await User.findOne({
        where: {
            user_id: invData.user_id
        },
        attributes: ['user_id', 'first_name', 'city', 'state', 'country', 'telephone']
    });
    invData.user = userDetails;

    const vendorDetails = await Vendor.findOne({
        where: {
            user_id: invData.seller_id
        },
        attributes: ["first_name", "last_name"]
    });
    invData.vendor = vendorDetails;
    if(!invData){
        return res.status(404).send({
            success: false,
            message: "Invoice Not Found!"
        })
    }
    return res.send(invData)
}


// Dues report
exports.duesReport = async (req, res) => {
    const data = [];
    const report = await dueClearRequest.findAll({
        where: {
            user_id: req.vendor.user_id
        },
        order: [
            ['id', 'DESC']
        ]
    });

    for (let i = 0; i < report.length; i++) {
        const r = report[i].getValues();
        r.first_name = req.vendor.first_name;
        r.last_name = req.vendor.last_name;
        r.pay_proof = process.env.BASE_URL+"/franchisepanel/images/"+r.pay_proof;
        data.push(r);
    }
    return res.send(data)
}

// generate invoice
exports.generateInvoice = async (req, res) => {
    const body = req.body;
    let gst = 0,gstPercent=0, tax = 0;
    
    if(req.vendor.due_amount >= req.vendor.credit_limit){
        return res.status(203).send({
            success: false,
            message: "You have overdue your credit limit ! Please clear all dues !"
        });
    }

    const user = await User.findOne({
        where: {
            [Op.or]: [
                {
                    user_id: body.user_id,
                },
                {
                    username: body.user_id
                }
            ]
        }
    });
    if(!user) {
        return res.status(404).send({
            success: false,
            message: `${body.user_id} User not found`
        });
    }
    let invoices = await amountDetail.count({
        where: {
            invoice_no: body.invoice_no
        }
    })
    if(invoices){
        return res.status(500).send({
            success: false,
            message: `Invoice number ${body.invoice_no} already in use`
        })
    }
    let grandTotal = 0;
    body.products.forEach(async (product) => {
        let netPrice = product.price * product.qty;
        grandTotal += netPrice;
    });
    let adminCommision = grandTotal*req.vendor.commission_percent/100;
    let totalDueAmount = req.vendor.due_amount + adminCommision;
    if(totalDueAmount > req.vendor.credit_limit){
        return res.status(403).send({
            success: false,
            message: "You Can Not Generate Commission More Than Your Credit Limit !"
        });
    }
    try {
        body.products.forEach(async (product) => {
            let netPrice = product.price * product.qty;
            let dataObj = {
                'invoice_no': body.invoice_no, 
                'product_name' : product.name, 
                'user_id' : body.user_id, 
                'quantity': product.qty, 
                'net_price' : netPrice, 
                'price' : product.price, 
                'gst' : gst, 
                'gst_percent' : gstPercent, 
                'tax' : tax, 
                'shipping' : 0, 
                'discount' : 0, 
                'dp': product.price, 
                'purchase_date': new Date().toISOString().split('T')[0], 
                'status': 0, 
                'seller_id' : req.vendor.user_id
            };
            eshopPurchaseDetail.create(dataObj);
        });
    } catch (error) {
        console.log(error);
        return res.status(503).send({
            success: false,
            message: error
        })
    }

    const transactionNo = req.vendor.user_id+parseInt(String(Math.floor(Math.random()*10000000)).padStart(7, 0));
    
    // try {
        pucCreditDebit.create({
            transaction_no: transactionNo,
            user_id: req.vendor.user_id, 
            credit_amt: adminCommision,
            debit_amt: 0, 
            admin_charge: 0, 
            receiver_id: 'Admin', 
            sender_id: req.vendor.user_id, 
            receive_date: new Date().toISOString().split('T')[0],
            ttype: 'Admin Commission', 
            TranDescription: `Admin get ${req.vendor.commission_percent} % of commission`, 
            Cause: grandTotal, 
            Remark: req.vendor.commission_percent, 
            invoice_no: body.invoice_no, 
            product_name: 0, 
            status: 0, 
            ewallet_used_by: 'Admin Wallet',
            // ts: new Date().toISOString(),
            current_url: 0 ,
            // lost_amt: 0
        });
    // } catch (error) {
    //     console.log(error);
    //     return res.status(503).send({
    //         success: false,
    //         message: error
    //     })
    // }

    try {
        await pocRegistration.update({
            due_amount: db.Sequelize.literal(`due_amount+${adminCommision}`)
        },{
            where: {
                user_id: req.vendor.user_id
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(503).send({
            success: false,
            message: error
        })
    }

    try {
        await amountDetail.create({
            user_id: user.user_id,
            seller_id: req.vendor.user_id,
            total_invoice_cv: grandTotal,
            invoice_no: body.invoice_no, 
            net_amount: grandTotal, 
            discount: 0, 
            total_amount: grandTotal, 
            payment_date: new Date().toISOString().split('T')[0], 
            status: 0, 
            // ts: new Date().toISOString(), 
            shipping_charge: 0, 
            tax: 0, 
            payment_type: 0, 
            shipping_status: 0, 
            purchase_date: new Date().toISOString().split('T')[0], 
            date: new Date().toISOString().split('T')[0]
        });
    } catch (error) {
        console.log(error);
        return res.status(503).send({
            success: false,
            message: error
        })
    }
    let matrix = await matrixDownline.findAll({
        where: {
            down_id: user.user_id
        }
    });
    matrix.forEach(async (mD) => {
        let [results, metadata] = await db.sequelize.query(`select l${mD.level} as lvl from status_maintenance_puc where id='1'`);
        let percentage = results[0].lvl;
        let commission = grandTotal*percentage/100;
        let adminCharge = 0;
        let Invoice = mD.income_id+parseInt(String(Math.floor(Math.random()*10000000)).padStart(7, 0));
        let countCoFounders = await User.count({
            where: {
                user_id: mD.income_id,
                co_founder: 1
            }
        });
        let cfper = 0;
        let cfcommision = 0;
        let cfadmin_charge = 0;
        if(countCoFounders > 0){
            let [results,  metadata] = await db.sequelize.query(`select cofounder_percent from status_maintenance_puc where id='1'`);
            cfper = results[0].cofounder_percent;
            cfcommision = grandTotal*cfper/100; 
            cfadmin_charge = 0;
        }

        if(commission!='' || commission!=0 || cfcommision!='' || cfcommision!=0){
            let totalIncome = await creditDebit.sum('credit_amt', {
                where: {
                    user_id: mD.income_id,
                    [Op.or]: [
                        {ttype: 'Level Income'},
                        {ttype: 'Co-founder Income'},
                    ]
                }
            });
            let confirmAmount = cfcommision + commission + totalIncome;
            let totalCommision = cfcommision + commission;
            let lj = await lifejacketSubscription.findOne({
                where : {
                    user_id: mD.income_id
                },
                attributes:['amount','package'],
                order: [
                    ['id', 'DESC']
                ]
            });
            let capping = 0;
            if(lj.package==1){
                capping=10000;
            } else if(lj.package==2){
                capping=25000;
            } else if(lj.package==3){
                capping=50000;
            }

            if(confirmAmount <= capping){
                if(mD.level <= 5){ 
                    try {
                        creditDebit.create({
                            transaction_no: Invoice,
                            user_id: mD.income_id,
                            credit_amt: commission,
                            debit_amt: 0,
                            admin_charge: adminCharge,
                            receiver_id: mD.income_id,
                            sender_id: user.user_id,
                            receive_date: new Date().toISOString().split('T')[0],
                            ttype: 'Level Income',
                            TranDescription: mD.level,
                            Cause: percentage,
                            Remark: grandTotal,
                            invoice_no: Invoice,
                            product_name: body.invoice_no,
                            status: 0,
                            ewallet_used_by: 'E Wallet',
                            // ts: new Date().toISOString(),
                            current_url: body.current_url,
                            package_id: 0,
                            percent: 0,
                            total_invesment_amount: 0
                        })
                    } catch (error) {
                        console.log(error);
                        return res.status(503).send({
                            success: false,
                            message: error
                        })
                    }
                }

                if(countCoFounders > 0){
                    try {
                        creditDebit.create({
                            transaction_no: Invoice,
                            user_id: mD.income_id,
                            credit_amt: cfcommision,
                            debit_amt: 0,
                            admin_charge: cfadmin_charge,
                            receiver_id: mD.income_id,
                            sender_id: user.user_id,
                            receive_date: new Date().toISOString().split('T')[0],
                            ttype: 'Co-founder Income',
                            TranDescription: mD.level,
                            Cause: cfper,
                            Remark: grandTotal,
                            invoice_no: Invoice,
                            product_name: body.invoice_no,
                            status: 0,
                            ewallet_used_by: 'E Wallet',
                            // ts: new Date().toISOString(),
                            current_url: body.current_url,
                            package_id: 0,
                            percent: 0,
                            total_invesment_amount: 0
                        })
                    } catch (error) {
                        console.log(error);
                        return res.status(503).send({
                            success: false,
                            message: error
                        })
                    }
                }
            }else{
                let required = capping - totalIncome;
                if(totalCommision >= required){
                    let remaining = totalCommision - required;
                    if(required > 0 && mD.level <= 5){
                        try {
                            creditDebit.create({
                                transaction_no: Invoice,
                                user_id: mD.income_id,
                                credit_amt: required,
                                debit_amt: 0,
                                admin_charge: adminCharge,
                                receiver_id: mD.income_id,
                                sender_id: user.user_id,
                                receive_date: new Date().toISOString().split('T')[0],
                                ttype: 'Level Income',
                                TranDescription: mD.level,
                                Cause: percentage,
                                Remark: grandTotal,
                                invoice_no: Invoice,
                                product_name: body.invoice_no,
                                status: 0,
                                ewallet_used_by: 'E Wallet',
                                // ts: new Date().toISOString(),
                                current_url: body.current_url,
                                package_id: 0,
                                percent: 0,
                                total_invesment_amount: 0,
                                lost_amt: remaining
                            })
                        } catch (error) {
                            console.log(error);
                            return res.status(503).send({
                                success: false,
                                message: error
                            })
                        }
                    }
                }else{
                    if(mD.level <= 5){
                        try {
                            creditDebit.create({
                                transaction_no: Invoice,
                                user_id: mD.income_id,
                                credit_amt: commission,
                                debit_amt: 0,
                                admin_charge: adminCharge,
                                receiver_id: mD.income_id,
                                sender_id: user.user_id,
                                receive_date: new Date().toISOString().split('T')[0],
                                ttype: 'Level Income',
                                TranDescription: mD.level,
                                Cause: percentage,
                                Remark: grandTotal,
                                invoice_no: Invoice,
                                product_name: body.invoice_no,
                                status: 0,
                                ewallet_used_by: 'E Wallet',
                                // ts: new Date().toISOString(),
                                current_url: body.current_url,
                                package_id: 0,
                                percent: 0,
                                total_invesment_amount: 0,
                                lost_amt: 0
                            })
                        } catch (error) {
                            console.log(error);
                            return res.status(503).send({
                                success: false,
                                message: error
                            })
                        }
                    }
                    if(countCoFounders > 0){
                        try {
                            creditDebit.create({
                                transaction_no: Invoice,
                                user_id: mD.income_id,
                                credit_amt: cfcommision,
                                debit_amt: 0,
                                admin_charge: cfadmin_charge,
                                receiver_id: mD.income_id,
                                sender_id: user.user_id,
                                receive_date: new Date().toISOString().split('T')[0],
                                ttype: 'Co-founder Income',
                                TranDescription: mD.level,
                                Cause: cfper,
                                Remark: grandTotal,
                                invoice_no: Invoice,
                                product_name: body.invoice_no,
                                status: 0,
                                ewallet_used_by: 'E Wallet',
                                // ts: new Date().toISOString(),
                                current_url: body.current_url,
                                package_id: 0,
                                percent: 0,
                                total_invesment_amount: 0,
                                lost_amt: 0
                            })
                        } catch (error) {
                            console.log(error);
                            return res.status(503).send({
                                success: false,
                                message: error
                            })
                        }
                    }
                }
            }
        }
    })
    return res.status(200).send({
        success: true,
        message: 'Invoice generated successfully!'
    })
}

// check if user exist or not with user id 
exports.checkUser  = async (req, res) => {
    let user_id = req.params.user_id;
    const user = await User.findOne({
        where: {
            user_id: user_id
        }
    });
    if(user) {
        return res.status(200).send({
            success: true,
            response: {
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
            }
        });
    }else{
        return res.status(404).send({
            success: false,
            response : {}
        })
    }
}


// pay dues api
exports.payDues  = async (req, res) => {
    let body = req.body
    let checkDueAmount = await pocRegistration.findOne({
        where: {
            user_id: req.vendor.user_id
        }
    })
    checkDueAmount = checkDueAmount.getValues()
    if(checkDueAmount.due_amount < body.amount ){
        return res.status(400).send({
            success: false,
            message: "You can not pay more than due amount!"
        })
    }

    if(body.amount == '' || body.amount == 0){
        return res.status(400).send({
            success: false,
            message: "You can not pay this amount!"
        })
    }
    let txn_id = await publicController.makeid(7)
    let dueClearRequestData = {
        user_id: req.vendor.user_id,
        amount: body.amount,
        status: 0, 
        // ts: new Date().toISOString(), 
        txn_id: req.vendor.user_id+'-'+txn_id, 
        payment_mode: body.payment_mode, 
        admin_status: 0,
        posted_date: new Date().toISOString()
    }
    try {
        let duepay = await dueClearRequest.create(dueClearRequestData);
        return res.status(200).send({
            success: true,
            id: duepay.id,
            message: "Due pay request submited successfully!"
        })
    } catch (error) {
        return publicController.errorHandlingFunc(req, res, error.message);
    }
}

// upload proof ie image
exports.payDuesProof  = async (req, res) => {
    let id = req.params.id;
    const storage =   multer.diskStorage({  
        destination:  (req, file, callback) => {  
          callback(null, payDuesProofPath);  
        },
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);  
        }
    });
    var upload = multer({ storage : storage}).single('payment_proof');   
    upload(req,res,async (err) => {
        if(!req.file){
            return res.status(403).send({
                message: "No file selected."
            })
        }else if(req.file.mimetype){
            const arr = req.file.mimetype.split('/');
            if(arr[0] !== 'image'){
                dueClearRequest.delete(id);
                return res.status(203).send({
                    success: false,
                    message: 'Invalid filetype. Only images are allowed'
                });
            }
        }
        if(err) {
            dueClearRequest.delete(id);
            return res.status(500).send({
                success: false,
                message: "Error uploading Proof."
            });  
        }
        let resp = await dueClearRequest.update({pay_proof: req.file.filename}, {
            where: {
                id: id
            }
        });
        if(resp) {
            return res.status(200).send({
                success: true,
                message: "Proof uploaded successfully!"
            })  
        }
        dueClearRequest.delete(id);
        return res.status(500).send({
            success: false,
            message: "Error while uploading pay proof"
        });
    });  
}

// return details of user if exists
exports.checkUserId = async (req, res) => {
    let userid = req.params.userid
    let user = await User.findOne({
        where: {
            [Op.or]: [
                {
                    user_id: userid
                },
                {
                    username: userid
                }
            ]
        }
    })
    if(!user){
        return res.status(404).send({
            success: false,
            message: "Invalid userid"
        })
    }
    return res.send({
        success: true,
        name: user.first_name+' '+user.last_name
    })
}


// Check invoice no already in use or not.
exports.checkInvoice = async (req, res) => {
    let invoice = req.params.invoice
    let invoices = await amountDetail.count({
        where: {
            invoice_no: invoice
        }
    })
    if(invoices){
        return res.status(500).send({
            success: false,
            message: "Invoice already in use"
        })
    }
    return res.send({
        success: true,
        message: 'Invoice is available' 
    })
}