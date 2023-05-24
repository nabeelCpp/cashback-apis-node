const multer = require("multer");
const db = require("../../../models");
const fs = require('fs');
const {Tickets} = db;
const Op = db.Sequelize.Op;
const publicController = require('../../public.controller');
const profileImagePath = `${process.env.PROJECT_DIR}/images/`;
var bcrypt = require("bcrypt");
exports.index = async (req, res) => {
    let id = req.params?.id
    let tickets = !id ? await Tickets.findAll({
        where: {
            status: 0
        }
    }) : await Tickets.findByPk(id)
    return res.send(tickets||{})
}


exports.closedTickets = async (req, res) => {
    let id = req.params?.id
    let tickets = !id ? await Tickets.findAll({
        where: {
            status: 1
        }
    }) : await Tickets.findByPk(id)
    return res.send(tickets||{})
}

exports.saveResponse = async (req, res) => {
    let id = req.params.id
    let ticket = await Tickets.findByPk(id)
    let body = req.body
    const NOW = new Date()
    if(ticket){
        Tickets.update({
            response: body.response,
            status: 1,
            c_t_date: NOW.toISOString().split('T')[0]
        }, {
            where: {
                id: id
            }
        })
        return res.status(200).send({
            success: true,
            message: "Ticket updated successfully!"
        })
    }
    return res.status(401).send({
        success: false,
        message: "Invalid ticket id"
    })
}

exports.deleteTicket = async (req, res) => {
    let id = req.params.id
    let ticket = await Tickets.findByPk(id)
    if(ticket){
        Tickets.destroy({
            where : {
                id: id
            }
        })
        return res.send({
            success: true,
            message: "Ticket removed successfully!"
        })
    }
    return res.status(401).send({
        success: false,
        message: "Invalid ticket id"
    })
}