const db = require("../../../models");
const { amountDetail, creditDebit, pocRegistration} = db;
const Op = db.Sequelize.Op;
module.exports = async (req, res) => {
    let body = Object.keys(req.body).length === 0?'':req.body
    let commisions = []
    if(body){
        if(body.user_id && body.date_from && body.date_to){
            commisions = await amountDetail.findAll({
                where: {
                    seller_id: body.user_id,
                    payment_date: {
                        [Op.between] : [new Date(body.date_from).toISOString(), new Date(body.date_to).toISOString()]
                    }
                }
            });
        }else if(body.user_id && body.date_from){
            commisions = await amountDetail.findAll({
                where: {
                    seller_id: body.user_id,
                    payment_date: {
                        [Op.between] : [new Date(body.date_from).toISOString(), new Date().toISOString()]
                    }
                }
            });
        }else if(body.user_id &&  body.date_to){
            commisions = await amountDetail.findAll({
                where: {
                    seller_id: body.user_id,
                    payment_date: {
                        [Op.lte] : new Date(body.date_to).toISOString()
                    }
                }
            });
        }else if(body.user_id){
            commisions = await amountDetail.findAll({
                where: {
                    seller_id: body.user_id
                }
            });
        }
    }else{
        console.log('asasd')
        commisions = await amountDetail.findAll();
    }
    let data = [];
    let total = 0
    let tCommision = 0
    let totalPayout  = 0
    let grandRevenue  = 0
    for (let i = 0; i < commisions.length; i++) {
        const c = commisions[i].getValues()
        total += c.net_amount
        let vendor = await pocRegistration.findOne({
            where: {
                user_id: c.seller_id
            }
        })
        vendor = vendor.getValues()
        let levelCom = await creditDebit.sum("credit_amt", {
            where: {
                product_name: c.invoice_no,
                status: 1,
                ttype: 'Level Income',
            }
        })

        let coFounder = await creditDebit.sum("credit_amt", {
            where: {
                product_name: c.invoice_no,
                status: 1,
                ttype: 'Co-founder Income',
            }
        })
        let totalCommision = c.net_amount*vendor.commission_percent/100
        tCommision += parseFloat(totalCommision)
        let totalPayoutDistribution = levelCom + coFounder
        totalPayout += totalPayoutDistribution
        let companyRevenue = totalCommision - totalPayoutDistribution;
        grandRevenue += companyRevenue
        let temp = {
            payoutDate: c.payment_date,
            totalSaleFromVendor: c.net_amount,
            totalCommision: totalCommision,
            totalPayoutDistribution: totalPayoutDistribution,
            companyRevenue: companyRevenue
        }
        data.push(temp)
    }
    const response = {};
    response.totalSale = total
    response.totalCommision = tCommision
    response.totalPayoutDistribution = totalPayout
    response.totalCompanyRevenue  = grandRevenue
    response.data = data
    return res.send(response)
}