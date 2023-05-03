const db = require("../../../models");
const {finalEWallet, creditDebit, User, withdrawRequest} = db;
const Op = db.Sequelize.Op;

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
    // const user = await User.findOne({
    //     where: {
    //         user_id: req.user.user_id
    //     },
    //     attributes: ['bank_nm', 'branch_nm', 'ac_no', 'swift_code']
    // });
    return res.status(200).send({
        message: true
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