const db = require("../../../models");
const {User, lifejacketSubscription, creditDebit} = db;
const Op = db.Sequelize.Op;
exports.memberPackage = async (req, res) => {
    let records = await lifejacketSubscription.findAll({
        where: {
            [Op.and]: [
                {
                    pay_type: {
                        [Op.ne]: 'Bitcoin Payment'
                    }
                },
                {
                    pay_type: {
                        [Op.ne]: 'Admin Activation'
                    }
                }
            ]
        },
        order: [
            ['id', 'DESC'],
        ]
    });
    let data = [];
    let totalCommision = 0;
    for (let i = 0; i < records.length; i++) {
        const record = records[i].getValues()
        let user = await User.findOne({
            where: {
                user_id: record.user_id
            }
        })
        let temp = {
            user_id: record.user_id,
            username: user?.username,
            memberName: user?.first_name+' '+user?.last_name,
            memberEmail: user?.email,
            packageAmount: record.amount, 
            purchaseDate: record.date, 
            expireDate: record.expire_date
        }
        data.push(temp)
        totalCommision += parseInt(record.amount)
    }
    let response = {}
    response.totalCommision = totalCommision;
    response.data = data
    return res.send(response)
}

exports.paidLevelBonus = async (req, res) => {
    let records = await creditDebit.findAll({
        where: {
            ttype: "Level Income",
            status: {
                [Op.ne]: 0
            },
        },
        order: [
            ['id', 'DESC']
        ]
    })
    let data = [];
    let totalCommision = 0
    for (let index = 0; index < records.length; index++) {
        const record = records[index].getValues()
        let user = await User.findOne({
            where: {
                user_id: record.user_id
            }
        })

        let sender = await User.findOne({
            where: {
                user_id: record.sender_id
            }
        })
        totalCommision += parseInt(record.credit_amt)
        let temp = {
            receiverUserId: record.user_id,
            username: user?.username,
            membername: user?.first_name+' '+user?.last_name,
            senderUserId: record.sender_id,
            senderMembername:sender?.username,
            commision: record.credit_amt,
            trasactionType: record.ttype,
            level: record.TranDescription,
            status: record.status==0?"Unpaid":"Paid",
            date: record.ts
        }
        data.push(temp)
    }
    let response = {}
    response.totalCommision = totalCommision
    response.data = data
    return res.send(response)
}
// un paid level bonus
exports.unPaidLevelBonus = async (req, res) => {
    let records = await creditDebit.findAll({
        where: {
            ttype: "Level Income",
            status:  0
        },
        order: [
            ['id', 'DESC']
        ]
    })
    let data = [];
    let totalCommision = 0
    for (let index = 0; index < records.length; index++) {
        const record = records[index].getValues()
        let user = await User.findOne({
            where: {
                user_id: record.user_id
            }
        })

        let sender = await User.findOne({
            where: {
                user_id: record.sender_id
            }
        })
        totalCommision += parseFloat(record.credit_amt)
        let temp = {
            receiverUserId: record.user_id,
            username: user?.username,
            membername: user?.first_name+' '+user?.last_name,
            senderUserId: record.sender_id,
            senderMembername:sender?.username,
            commision: record.credit_amt,
            trasactionType: record.ttype,
            level: record.TranDescription,
            status: record.status==0?"Unpaid":"Paid",
            date: record.ts
        }
        data.push(temp)
    }
    let response = {}
    response.totalCommision = totalCommision
    response.data = data
    return res.send(response)
}

// cofounder income paid
exports.paidCofounderIncome = async (req, res) => {
    let records = await creditDebit.findAll({
        where: {
            ttype: "Co-founder Income",
            status: {
                [Op.ne]: 0
            }
        },
        order: [
            ['id', 'DESC']
        ]
    })
    let data = [];
    let totalCommision = 0
    for (let index = 0; index < records.length; index++) {
        const record = records[index].getValues()
        let user = await User.findOne({
            where: {
                user_id: record.user_id
            }
        })

        let sender = await User.findOne({
            where: {
                user_id: record.sender_id
            }
        })
        totalCommision += parseFloat(record.credit_amt)
        let temp = {
            userId: record.user_id,
            username: user?.first_name+' '+user?.last_name,
            purchasedAmount: record.Remark,
            percentage:record.Cause,
            amount: record.credit_amt,
            remark: record.Cause,
            purchasedInvoice: record.product_name,
            date: record.ts
        }
        data.push(temp)
    }
    let response = {}
    response.totalCommision = totalCommision
    response.data = data
    return res.send(response)
}
// Un paid co founder income
exports.unPaidCofounderIncome = async (req, res) => {
    let records = await creditDebit.findAll({
        where: {
            ttype: "Co-founder Income",
            status: 0
        },
        order: [
            ['id', 'DESC']
        ]
    })
    let data = [];
    let totalCommision = 0
    for (let index = 0; index < records.length; index++) {
        const record = records[index].getValues()
        let user = await User.findOne({
            where: {
                user_id: record.user_id
            }
        })

        let sender = await User.findOne({
            where: {
                user_id: record.sender_id
            }
        })
        totalCommision += parseFloat(record.credit_amt)
        let temp = {
            userId: record.user_id,
            username: user?.first_name+' '+user?.last_name,
            purchasedAmount: record.Remark,
            percentage:record.Cause,
            amount: record.credit_amt,
            remark: record.Cause,
            purchasedInvoice: record.product_name,
            date: record.ts,
            status: record.status==0?"Unpaid":"Paid"
        }
        data.push(temp)
    }
    let response = {}
    response.totalCommision = totalCommision
    response.data = data
    return res.send(response)
}