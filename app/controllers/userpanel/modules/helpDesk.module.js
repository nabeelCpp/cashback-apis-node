const db = require("../../../models");
const {Tickets} = db;
const Op = db.Sequelize.Op;
exports.ticketCategories = async (req, res) => {
    return res.status(200).send({
        categories: ['Financial', 'Technical', 'General', 'Product', 'Others']
    });
}

exports.openTicket = async (req, res) => {
    const {category, subject, message} = req.body;
    let ticket = await Tickets.findOne({
        order: [
            ['id', 'DESC']
        ]
    });
    let ticket_no = 1;
    if(ticket){
        ticket_no = parseInt(ticket.ticket_no) + 1;
    }
    const response = await Tickets.create({
        user_id: req.user.user_id,
        user_name: req.user.username,
        subject: subject,
        tasktype: category,
        description: message,
        t_date: new Date().toISOString().split('T')[0],
        ticket_no: ticket_no
    });
    if(response) {
        return res.status(200).send({
            message: "Ticket Submitted Successfully !",
            ticket: response,
        })
    }
    return res.status(403).send({
        message: "Error while saving ticket"
    });
}

exports.viewTicket = async (req, res) => {
    const tickets = await Tickets.findAll({
        where: {
            user_id: req.user.user_id,
        },
        order: [
            ['id', 'DESC']
        ]
    });
    return res.send(tickets);
}