const db = require("../../../models");
const {lifejacketSubscription, statusMaintenance, amountDetail, pocRegistration} = db;
const Op = db.Sequelize.Op;
exports.myPackagePurchase = async (req, res) => {
    let arr = await lifejacketSubscription.findAll({
        where: {
            user_id: req.user.user_id,
        },
        order: [
            ['id', 'desc']
        ]
    });
    const data = [];
    for (let i = 0; i < arr.length; i++) {
        let rec = arr[i];
        let package = await statusMaintenance.findByPk(rec.package);
        const temp = {
            sn: i+1,
            invoice_no : rec.transaction_no,
            package_name: package.name,
            amount: rec.amount,
            date: rec.date 
        }
        data.push(temp);
    }
    return res.status(200).send(data);
}

exports.myShoppingInvoices = async (req, res) => {
    const arr = await amountDetail.findAll({
        where : {
            user_id: req.user.user_id
        },
        order: [
            ['am_id', 'DESC']
        ]
    });
    const data = [];
    for (let i = 0; i < arr.length; i++) {
        const inv = arr[i];
        const poc =  await pocRegistration.findOne({
            where: {
                user_id: inv.seller_id,
            }
        });
        const temp = {
            sn: i+1,
            seller_id: inv.seller_id,
            seller_username: poc.username,
            total_amount: inv.total_amount,
            date: inv.date,
            invoice_no: inv.invoice_no
        };
        data.push(temp);
    }
    return res.status(200).send(data);
}

