const db = require("../../../models");
const {User, matrixDownline, finalEWallet, statusMaintenance, amountDetail, lifejacketSubscription, creditDebit} = db;
const Op = db.Sequelize.Op;
module.exports = async (req, res) => {
    const data = {};
    let total_downline = await matrixDownline.findAll({where: { income_id: req.user.user_id }});
    let direct_downline = await User.findAll({where: { ref_id: req.user.user_id, nom_id: { [Op.ne]: '' } }});
    const wallet = await finalEWallet.findOne({where: { user_id: req.user.user_id }});
    const plan = await statusMaintenance.findByPk(req.user.user_plan);
    let curDate = new Date();
  
    const currentMonthSale = await amountDetail.sum('total_invoice_cv', { 
      where : { 
        user_id: req.user.user_id,
        purchase_date: {
          [Op.between]:[`${curDate.getFullYear}-${curDate.getMonth()+1}-01`, `${curDate.getFullYear}-${curDate.getMonth()+2}-01`],
        }
      } });
    const totalSale = await amountDetail.sum('total_invoice_cv', { where : { user_id: req.user.user_id } });
    const lifejacketSubscriptionDetails = await lifejacketSubscription.findOne({
      where: {
        user_id: req.user.user_id, 
        pb:{
          [Op.gt]: 0
        },
      },
      attributes: ['amount','package'],
      order: [
        ['id', 'desc']
      ],
      offset: 0, 
      limit: 1
    });
    data.referralLink = req.user.username; //referral link
    data.capping = 0;
    if(lifejacketSubscriptionDetails.package == 1){
      data.capping = 10000; //Capping
      data.totalearining = 10000; //Capping
    }else if(lifejacketSubscriptionDetails.package == 2){
      data.capping = 25000; //Capping
      data.totalearining = 25000; //Capping
    }else if(lifejacketSubscriptionDetails.package == 3){
      data.capping = 50000; //Capping
      data.totalearining = 50000;
    }
  
    
    const creditDebitFunc = (arr, notEqual='') => {
      return creditDebit.sum('credit_amt', { 
        where: { 
          user_id: req.user.user_id,
          ttype : {
            [Op.and] : [
              {
                [Op.ne] : notEqual,
              },
              {
                [Op.or] : arr
              }
            ]
          }
        } 
      }).then(resp=>{
        if(resp){
          return resp.toFixed(2);
        }
        return (0).toFixed(2);
      })
    }
    data.totalIncome = await creditDebitFunc(['Level Income', 'Co-founder Income']); //Level Earning, //TOTAL INCOME
  
    data.yesterdayEarning = await creditDebitFunc(['Referral Bonus', 'Binary Income', 'Roi Income', 'Level Income'], 'Fund Transfer')
    data.directIncome = await creditDebitFunc(['Referral Bonus']);
    data.binaryEarning = await creditDebitFunc(['Level Income']);
    data.matchingEarning = await creditDebitFunc(['Roi Income']);
    data.totalCofounderIncome = await creditDebitFunc(['Co-founder Income']);
    // data.totalEarning = totalEarning;
    data.currentMonthSale = currentMonthSale?currentMonthSale.toFixed(2):(0).toFixed(2); //monthly purchase as well, //Purchase(Current month)
    data.totalSale = totalSale?totalSale.toFixed(2):(0).toFixed(2); //also anual purchase. , //TOTAL PURCHASE
    data.anualTarget = (parseInt(plan.amount)*12).toFixed(2);
    data.monthlyTarget = parseInt(plan.amount).toFixed(2); //Target(Current month)
    data.monthlyTargetMeterPercentage = (data.currentMonthSale/data.monthlyTarget)*100;
    data.annualTargetMeterPercentage = (totalSale/(plan.amount*12))*100;
    data.walletAmount = wallet?wallet.amount.toFixed(2):(0).toFixed(2); //Income Wallet
    data.direct_downline = direct_downline.length; // TOTAL DIRECT
    data.total_downline = total_downline.length; // TOTAL DOWNLINE
   
    return res.status(200).send(data);
};