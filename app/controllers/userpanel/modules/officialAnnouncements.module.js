const db = require("../../../models");
const {Promo} = db;
const Op = db.Sequelize.Op;

exports.index = async (req, res) => {
    let promos = await Promo.findAll({
        where: {
            status: 1
        }
    });
    for (let i = 0; i < promos.length; i++) {
        const promo = promos[i].getValues();
        promo.sn = i+1;
        
    }
    return res.status(200).send(promos);
}

exports.view = async (req, res) => {
    let promo = await Promo.findByPk(req.params.id);
    return res.send(promo);
}