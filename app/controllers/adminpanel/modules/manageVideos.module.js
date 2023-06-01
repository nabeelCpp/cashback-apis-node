const db = require("../../../models");
const { Video} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
exports.index = async (req, res) => {
    let annoucements = await Video.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    return res.send(annoucements)
}

exports.create = async (req, res) => {
    let body = req.body
    let create = await Video.create({
        title: body.title,
        description: body.description,
        video_link: body.link,
        upload_date: new Date().toISOString()
    })
    return res.send({
        success: true,
        message: "Video created successfully!",
        data: create
    })
}

exports.update = async (req, res) => {
    let id = req.params.id
    let body = req.body
    let video = await Video.findByPk(id)
    if(video){
        video.title = body.title || video.title
        video.description = body.description || video.description
        video.video_link = body.link || video.video_link
        video.upload_date = new Date().toISOString()
        await Video.update(video.getValues(), {
            where: {
                id: id
            }
        })
        return res.send({
            success: true,
            message: "Video updated successfully!",
        })
    }
    return res.status(500).send({
        success: false,
        message: "Invalid id passed."
    })
}

exports.delete = async (req, res) => {
    let id = req.params.id
    let video = await Video.findByPk(id)
    if(video){
        Video.destroy({
            where : {
                id: id
            }
        })
        return res.send({
            success: true,
            message: "Video removed successfully!"
        })
    }
    return res.status(500).send({
        success: false,
        message: "Invalid id passed."
    })
}
