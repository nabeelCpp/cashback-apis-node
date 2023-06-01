const db = require("../../../models");
const {Promo} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
exports.index = async (req, res) => {
    let annoucements = await Promo.findAll({
        order: [
            ['n_id', 'DESC']
        ]
    })
    return res.send(annoucements)
}

exports.create = async (req, res) => {
    let body = req.body
    let create = await Promo.create({
        news_name: body.title,
        description: body.description,
        status: body.status,
        posted_date: new Date().toISOString()
    })
    return res.send({
        success: true,
        message: "Annoucement created successfully!",
        data: create
    })
}

exports.update = async (req, res) => {
    let id = req.params.id
    let body = req.body
    let promo = await Promo.findByPk(id)
    if(promo){
        promo.news_name = body.title || promo.news_name
        promo.description = body.description || promo.description
        promo.status = body.status || promo.status
        promo.posted_date = new Date().toISOString()
        await Promo.update(promo.getValues(), {
            where: {
                n_id: id
            }
        })
        return res.send({
            success: true,
            message: "Annoucement updated successfully!"
        })
    }
    return res.status(500).send({
        success: false,
        message: "Invalid id passed."
    })
}

exports.delete = async (req, res) => {
    let id = req.params.id
    let promo = await Promo.findByPk(id)
    if(promo){
        Promo.destroy({
            where : {
                n_id: id
            }
        })
        return res.send({
            success: true,
            message: "Annoucement removed successfully!"
        })
    }
    return res.status(500).send({
        success: false,
        message: "Invalid id passed."
    })
}
