const db = require("../../../models");
const {User, finalEWallet, creditDebit} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
exports.users = async (req, res) => {
    let users = await User.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: ['user_id', 'username', 'first_name', 'last_name']
    });
    for (let i = 0; i < users.length; i++) {
        const user = users[i].getValues();
        let f = await finalEWallet.findOne({
            where: {
                user_id: user.user_id
            }
        })
        user.incomeWallet = f?.amount
    }
    return res.send(users);
}

exports.manage = async (req, res) => {
    let body = req.body
    if(body.amount <= 0){
        res.status(400).send({
            success: false,
            message: "Amount must be greater than 0"
        })
    }
    // check if user exist or not
    let user = await User.findOne({
        where: {
            user_id: body.user_id
        }
    })
    if(!user){
        return res.status(400).send({
            success: false,
            message: "User not found!"
        })
    }
    let wType = body.wallet=='b_wallet'?'B Wallet':(body.wallet=='t_wallet'?'T Wallet':(body.wallet=='final_e_wallet'?'E Wallet':(body.wallet=='rmb_wallet'?'RMB Wallet':'')))
    let walletDbTable = body.wallet=='b_wallet'?'BWallet':(body.wallet=='t_wallet'?'TWallet':(body.wallet=='final_e_wallet'?'finalEWallet':(body.wallet=='rmb_wallet'?'RmbWallet':'')))
    let randId = await publicController.makeid(5)
    let transaction_no = body.user_id+randId
    let NOW = new Date()
    creditDebit.create({
        transaction_no : transaction_no, 
        user_id : body.user_id, 
        credit_amt: body.action=='add'?body.amount:0, 
        debit_amt: body.action=='subtract'?body.amount:0, 
        admin_charge: 0, 
        receiver_id: body.user_id, 
        sender_id: '', 
        receive_date: NOW.toISOString().split('T')[0], 
        ttype: 'Fund Transfer', 
        TranDescription : body.remark, 
        Cause: `Fund ${body.action=='add'?'Credited':'Deducted'} By Admin`, 
        Remark: `Fund ${body.action=='add'?'Credited':'Deducted'} By Admin`, 
        invoice_no: transaction_no, 
        product_name: `Fund ${body.action=='add'?'Credited':'Deducted'}`, 
        status: 0, 
        ewallet_used_by: wType, 
        ts: new Date().toISOString(), 
        current_url: `Balance ${body.action=='add'?'Credited':'Deducted'} From Admin panel wallet management`
    })
    finalEWallet.update({
        amount: db.sequelize.literal(`amount${body.action=='add'?'+':'-'}${body.amount}`)
    },{
        where: {
            user_id: body.user_id
        }
    })
    return res.send({
        success: true,
        message: `Ewallet Amount ${body.action=='add'?'Credited':'Deducted'} Successfully!`
    })
}

exports.ewalletHistory = async (req, res) => {
    let user_id = req.params.user_id
    // check if user exist or not
    let user = await User.findOne({
        where: {
            user_id: user_id
        }
    })
    if(!user){
        return res.status(400).send({
            success: false,
            message: "User not found!"
        })
    }
    let history = await creditDebit.findAll({
        where: {
            user_id: user_id
        }
    })
    let data = []
    for (let i = 0; i < history.length; i++) {
        const h = history[i]
        const user = await User.findOne({
            where: {
                user_id: h.user_id
            }
        })
        const sender = await User.findOne({
            where: {
                user_id: h.sender_id
            }
        })
        let temp = {
            userId: h.user_id,
            username: user?.username,
            senderId: h.sender_id,
            senderUsername: sender?.username||"",
            transactionType: h.ttype,
            credit: h.credit_amt,
            debit: h.debit_amt,
            date: h.receive_date,
        }
        data.push(temp)
        
    }
    return res.send(data)
}