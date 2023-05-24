const db = require("../../../models");
const {User, finalEWallet, statusMaintenance, amountDetail, creditDebit,  closingCreditDebit} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
exports.generatePayoutList = async (req, res) => {
    let users = await User.findAll({
        order: [
            ['id', 'ASC']
        ]
    })
    let totalPayableAmount = 0
    let data = []
    for (let i = 0; i < users.length; i++) {
        const user = users[i].getValues()
        let levelIncome = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                ttype: 'Level Income'
            }
        })

        let coFounderIncome = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                ttype: 'Co-founder Income'
            }
        })

        let creditDebitSum = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                [Op.or]: [
                    {
                        ttype: 'Level Income'
                    },
                    {
                        ttype: 'Co-founder Income'
                    }
                ]
            }
        })

        let target = await statusMaintenance.findByPk(user.user_plan)
        let bussinessAmount = await amountDetail.sum("total_invoice_cv",{
            where: {
                user_id: user.user_id,
                status: 0
            }
        })
        if(creditDebitSum > 0 && target.amount <= bussinessAmount){
            let temp = {
                userId: user?.user_id,
                fullName: user?.first_name||"" + user?.last_name||"",
                package: {
                    name: target.name,
                    amount: target.amount
                },
                selfPurchase: bussinessAmount||0,
                levelIncome: levelIncome||0,
                coFounderIncome: coFounderIncome||0,
                total: creditDebitSum||0
            }
            totalPayableAmount += parseFloat(creditDebitSum)
            data.push(temp)
        }
    }
    let response = {};
    response.totalPayableAmount = totalPayableAmount
    response.data = data
    return res.send(response)
}

exports.generatePayout = async (req, res) => {
    let body = req.body
    body.list.forEach(async (id) => {
        let user = await User.findOne({
            user_id: id
        })
        let currentPlan = await statusMaintenance.findByPk(user.user_plan)
        let totalpurchase = await amountDetail.sum("total_invoice_cv",{
            where: {
                user_id: id,
                status: 0
            }
        })
        let record = await creditDebit.sum("credit_amt", {
            where: {
                user_id: id,
                ttype: 'Level Income',
                status: 0
            }
        })

        let record1 = await creditDebit.sum("credit_amt", {
            where: {
                user_id: id,
                ttype: 'Co-founder Income',
                status: 0
            }
        })
        record1 = record1 || 0
        let total = record + record1
        if(total > 0 && currentPlan.amount <= totalpurchase)  {
            finalEWallet.update({
                amount: db.sequelize.literal(`amount+${total}`)
            },{
                where: {
                    user_id: id
                }
            })
            let transaction_no = await publicController.makeidNumeric(6)
            closingCreditDebit.create({
                transaction_no: transaction_no,
                user_id: id,
                credit_amt: total,
                binary_income: record,
                cofounder_income: record1,
                receive_date: new Date().toISOString().split('T')[0],
                bank_ref: 'NA',
                trans_date: new Date().toISOString().split('T')[0]
            })

            creditDebit.update({
                status:1
            }, {
                where: {
                    user_id: id,
                    status: 0,
                    ttype: {
                        [Op.in]: ['Level Income','Co-founder Income']
                    }
                }
            })
        }
    });
    return res.send({
        success: true,
        message: "Payout Generated successfully!"
    })
}

exports.closingReport = async (req, res) => {
    let users = await User.findAll({
        order: [
            ['id', 'ASC']
        ]
    })
    let totalPayableAmount = 0
    let data = []
    for (let i = 0; i < users.length; i++) {
        const user = users[i].getValues()
        let bussinessVolume = await amountDetail.sum("total_invoice_cv", {
            where : {
                user_id: user.user_id,
                status: 0
            }
        })
        let levelIncome = await creditDebit.sum("credit_amt", {
            where : {
                user_id: user.user_id,
                status: 1,
                ttype : 'Level Income'
            }
        })

        
        let coFounderIncome = await creditDebit.sum("credit_amt", {
            where : {
                user_id: user.user_id,
                status: 1,
                ttype : 'Co-founder Income'
            }
        })

        let total = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 1,
                [Op.or]: [
                    {
                        ttype: 'Level Income'
                    },
                    {
                        ttype: 'Co-founder Income'
                    }
                ]
            }
        })
        if(total > 0){
            totalPayableAmount += total
            let temp = {
                user_id: user.user_id,
                full_name: user?.first_name+' '+user?.last_name,
                bussiness_volume: bussinessVolume,
                level_income: levelIncome,
                cofounder_income: coFounderIncome,
                total: total
            }
            data.push(temp)
        }
    }
    let response = {};
    response.totalPayableAmount = totalPayableAmount
    response.data = data
    return res.send(response)
}

exports.allPayout = async (req, res) => {
    let users = await User.findAll({
        order: [
            ['id', 'ASC']
        ]
    })
    let totalPayableAmount = 0
    let data = []
    for (let i = 0; i < users.length; i++) {
        const user = users[i].getValues()
        let selfPurchase = await amountDetail.sum('total_invoice_cv', {
            where: {
                user_id: user.user_id,
                status: 0
            }
        })

        let levelIncome = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                ttype: 'Level Income'
            }
        })

        let coFounderIncome = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                ttype: 'Co-founder Income'
            }
        })

        let package = await statusMaintenance.findByPk(user.user_plan)
        let total = await creditDebit.sum("credit_amt", {
            where: {
                user_id: user.user_id,
                status: 0,
                [Op.or]: [
                    {
                        ttype: 'Level Income'
                    },
                    {
                        ttype: 'Co-founder Income'
                    }
                ]
            }
        })
        if(total > 0){
            totalPayableAmount += parseFloat(total)
            let temp = {
                user_id: user.user_id,
                full_name: user?.first_name+' '+user?.last_name,
                package: {
                    name: package.name,
                    target: package.amount
                },
                self_purchase: selfPurchase,
                level_income: levelIncome,
                cofounder_income: coFounderIncome,
                total: total
            }
            data.push(temp)
        }
        
    }
    let response = {};
    response.totalPayableAmount = totalPayableAmount
    response.data = data
    return res.send(response)
}