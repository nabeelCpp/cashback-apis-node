const db = require("../../../models");
const {statusMaintenance, lifejacketSubscription, User} = db;
const publicController = require('../../../controllers/public.controller')
const Op = db.Sequelize.Op;

// Upgrade to new plans
exports.upgradePlan = async (req, res) => {
    const response = [];
    var existingPlan = 0;
    await lifejacketSubscription.findOne({
      where: { user_id: req.user.user_id },
      attributes: ['package'],
      order: [
        ['id', 'desc']
      ], 
      limit: 1
    }).then(resp=>{
      if(resp) {
        existingPlan = resp.package;
      }
    });
    if(existingPlan == 3){
      return res.status(202).send({
        success: true,
        message: "You had already updated to higher Package!"
      })
    }
    const plans = await statusMaintenance.findAll({
      where: {
        id : {
          [Op.gt] : existingPlan,
        }
      }
    });
    return res.status(200).send(plans);
};

// List of plans history of logged in user.
exports.planHistory = async(req, res) => {
    const plans = await lifejacketSubscription.findAll({
        where: {
            user_id: req.user.user_id
        }
    });

    for (let index = 0; index < plans.length; index++) {
      const plan = plans[index].getValues();
      package = await statusMaintenance.findByPk(plan.package);
      plan.sn = index+1;
      plan.package_name = package.getValues().name;
    }
    return res.status(200).send(plans);
}

// Subscribe new plan and save upgrades to user in db
exports.subscribeNewPlan = async (req, res) => {
  let package = req.params.package
  let user = req.user
  let checkPackage = await statusMaintenance.findByPk(package)
  if(!checkPackage){
    return res.status(500).send({
      success: false,
      message: 'Something went wrong! Try again!'
    })
  }
  let rand = await publicController.makeidNumeric(7)
  let invoiceNo = user.user_id+rand
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 7300);
  let insertArr = {
    user_id: user.user_id, 
    package: package, 
    amount: checkPackage.amount, 
    pay_type: 'E Wallet', 
    pin_no: '123456', 
    transaction_no: invoiceNo, 
    date: new Date().toISOString().split('T')[0], 
    expire_date: expireDate, 
    remark: 'Package Purchase', 
    ts: `${new Date().toISOString().split('T')[0]} ${new Date().toISOString().split('T')[1].replace('Z', '')}`, 
    status: 'Active', 
    invoice_no: invoiceNo,
    lifejacket_id: `LJ${invoiceNo}`,
    username: user.user_id,
    sponsor: user.ref_id,
    pb: checkPackage.capping
  }
  try {
    await lifejacketSubscription.create(insertArr)
    await User.update({
      user_plan: package,
      designation: 'Paid User',
      user_rank_name: 'user_rank_name'
    }, {
      where: {
        user_id: user.user_id
      }
    })
  } catch (error) {
    return publicController.errorHandlingFunc(req, res, error.message);
  }
  return res.send({
    success: true,
    message: "You have successfully subscribed to new package!"
  })
}