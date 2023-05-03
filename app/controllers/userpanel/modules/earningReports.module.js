const db = require("../../../models");
const {creditDebit, User} = db;
const Op = db.Sequelize.Op;
exports.levelIncome = async (req, res) => {
    const credits = await creditDebit.findAll({
        where: {
            user_id: req.user.user_id,
            ttype:  'Level Income',
        },
        order : [
            ['id', 'DESC']
        ]
    });
    const data = [];
    for (let i = 0; i < credits.length; i++) {
        const credit = credits[i];
        const user = await User.findOne({
            where: {
                user_id: credit.sender_id
            },
            attributes: ['user_id', 'first_name', 'last_name']
        });
        const temp = {
            sn: i+1,
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.first_name+' '+user.last_name,
            investment: credit.Remark,
            percentage: credit.Cause,
            credit_amt: credit.credit_amt,
            cause: credit.Cause,
            date: credit.ts,
            status: credit.status == 1 ? "PAID": "UNPAID"
        }
        data.push(temp);
    }

    return res.status(200).send(data);
}

exports.coFounderIncome = async (req, res) => {
    const credits = await creditDebit.findAll({
        where: {
            user_id: req.user.user_id,
            ttype: 'Co-founder Income'
        },
        order: [
            ['id', 'DESC']
        ]
    });
    const data = [];
    for (let i = 0; i < credits.length; i++) {
        const credit = credits[i];
        const user = await User.findOne({
            where: {
                user_id: credit.sender_id
            },
            attributes: ['user_id', 'first_name', 'last_name']
        });
        const temp = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            last_name: user.last_name,
            investment: credit.Remark,
            percentage: credit.Cause,
            amount: credit.credit_amt,
            invoice: credit.product_name,
            date: credit.ts,
            status: credit.status == 1 ? "PAID": "UNPAID"
        }
        data.push(temp);
    }

    return res.status(200).send(data);
}

