const db = require("../../../models");
const {statusMaintenancePuc} = db;
const Op = db.Sequelize.Op;
exports.index = async (req, res) => {
    let record = await statusMaintenancePuc.findByPk(1)
    return res.send(record)
}

exports.update = async (req, res) => {
    let id = req.params.id
    let body = req.body
    let record = await statusMaintenancePuc.findByPk(id)
    if(!record){
        return res.status(500).send({
            success: false,
            message: "Invalid id passed"
        })
    }
    // update record
    record.l1 = body.l1||record.l1
    record.l2 = body.l2||record.l2
    record.l3 = body.l3||record.l3
    record.l4 = body.l4||record.l4
    record.l5 = body.l5||record.l5
    record.cofounder_percent = body.cofounder_percent||record.cofounder_percent
    record.save();
    return res.send({
        success: true,
        message: "Commisions Updated successfully!"
    })
}