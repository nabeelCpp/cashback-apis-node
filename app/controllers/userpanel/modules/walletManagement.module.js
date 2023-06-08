const db = require("../../../models");
const {finalEWallet, creditDebit, User, withdrawRequest} = db;
const Op = db.Sequelize.Op;
var bcrypt = require("bcrypt");
const publicController = require('../../public.controller')
exports.transactionHistory = async (req, res) => {
    const wallet = await finalEWallet.findOne({
        where: {
            user_id: req.user.user_id
        },
        attributes: ['amount']
    });
    const transactions = await creditDebit.findAll({
        where: {
            user_id: req.user.user_id,
            ewallet_used_by: 'E Wallet'
        },
        order: [
            ['id', 'DESC']
        ]
    });
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i].getValues();
        transaction.sn = i+1;
        if(transaction.sender_id == 'Admin'){
            transaction.full_name = 'Admin';
        }else{
            let user = await User.findOne({
                where: {
                    user_id: transaction.sender_id
                }
            });
            user = user.getValues();
            transaction.full_name = user.first_name+' '+user.last_name;
        }
        
    }
    return res.status(200).send({
        amount: wallet.amount,
        transactions: transactions
    });
}

exports.myWallet = async (req, res) => {
    const wallet = await finalEWallet.findOne({
        where: {
            user_id: req.user.user_id,
        },
        attributes: ['amount']
    });
    return res.status(200).send(wallet)
} 

exports.withdrawRequest = async (req, res) => {
    let user = req.user
    const bank = await User.findOne({
        where: {
            user_id: user.user_id
        },
        attributes: ['bank_nm', 'branch_nm', 'ac_no', 'swift_code', 'acc_name']
    });
    let wallet = await finalEWallet.findOne({
        where: {
            user_id: user.user_id
        }
    })
    let walletAmount = wallet.amount
    return res.status(200).send({
        walletAmount: walletAmount,
        fullname: user.first_name,
        accountName: bank.acc_name,
        accountNo: bank.ac_no,
        bankName: bank.bank_nm,
        branchName: bank.branch_nm,
        swiftCode: bank.swift_code,
    })
}
exports.checkPassword = async (req, res) => {
    let body = req.body
    let user = await User.findByPk(req.user.id)
    var passwordIsValid = bcrypt.compareSync(
        body.password,
        user.password
    );

    if(!passwordIsValid){
    passwordIsValid = user.password == body.password ? true : false;
    }

    if (!passwordIsValid) {
        return res.status(500).send({
            success: false,
            message: "Wrong Password!"
        });
    }
    if(body.amount < 10){
        return res.status(500).send({
            success: false,
            message: "Amount should be greater than or equal to 10 SAR!"
        })
    }
    return res.send({
        success: true,
        message: "Password is matched!"
    })
}

exports.submitWithdrawal = async (req, res) => {
    let body = req.body
    let user = req.user
    let wallet = await finalEWallet.findOne({
        user_id: user.user_id
    })
    let amount = wallet.amount

    let transactionCharge = 5
    let totalPaidAmount = body.amount - (body.amount * transactionCharge / 100)
    // update wallet balance
    finalEWallet.update({
        amount: amount - body.amount,
    }, {
        where: {
            user_id: user.user_id
        }
    })

    let rand = await publicController.makeidNumeric(7)

    // Insert credit debit 
    await creditDebit.create({
         transaction_no: rand, 
         user_id: user.user_id, 
         credit_amt: 0, 
         debit_amt: body.amount, 
         admin_charge: 0, 
         receiver_id: '123456', 
         sender_id: user.user_id, 
         receive_date: new Date().toISOString().split('T')[0], 
         ttype: 'Withdrawal Request', 
         TranDescription: 'Withdrawal Request From Admin', 
         Cause: 0, 
         Remark: 'Withdrawal Request', 
         invoice_no: rand, 
         product_name: 'Withdrawal Request', 
         status: 0, 
         ewallet_used_by: 'E Wallet',
         current_url: 'Cashback'
    })

    // insert withdraw requeset
    await withdrawRequest.create({
        transaction_number: rand,
        user_id: user.user_id,
        first_name: body.first_name,
        last_name: body.last_name||'',
        acc_name: body.acc_name,
        acc_number: body.acc_number,
        bank_nm: body.bank_nm,
        branch_nm: body.branch_nm,
        swift_code: body.swift_code,
        request_amount: body.amount,
        description: body.description,
        status: 0,
        posted_date: new Date().toISOString().split('T')[0],
        admin_remark: '',
        admin_response_date: '',
        withdraw_wallet: 'final_e_wallet',
        total_paid_amount: totalPaidAmount,
        transaction_charge: transactionCharge
    })

    return res.send({
        success: true,
        message: 'Request Sent Successfully !'
    })
}

exports.myWithdrawalRequests = async (req, res) => {
    const withdraw_request = await withdrawRequest.findAll({
        where: {
            user_id: req.user.user_id
        },
        order: [
            ['id', 'DESC']
        ]
    });

    for (let i = 0; i < withdraw_request.length; i++) {
        const element = withdraw_request[i].getValues();
        element.status = element.status=='0'?'Pending':'Paid';
        element.sn = i+1;
    }
    return res.status(200).send(withdraw_request);
}