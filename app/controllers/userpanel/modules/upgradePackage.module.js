const db = require("../../../models");
const {statusMaintenance, lifejacketSubscription} = db;
const Op = db.Sequelize.Op;
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

exports.subscribeNewPlan = async (req, res) => {
  return res.send({
    message: true
  })
}