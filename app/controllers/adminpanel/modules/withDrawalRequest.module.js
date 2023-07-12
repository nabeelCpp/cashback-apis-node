const db = require('../../../models');
const multer = require("multer");
const fs = require('fs');
const Op = db.Sequelize.Op;
const {pocRegistration, matrixDownline, User, amountDetail, finalEWallet, levelEWallet, statusMaintenance, lifejacketSubscription, dueClearRequest, pucCreditDebit, creditDebit, eshopPurchaseDetail, venderServices, pocRegisterDetails, withdrawRequest} = db;
const publicController = require('../../public.controller');

// Withdraw request with status 0
exports.open = async (req, res) => {
    let requests = await withdrawRequest.findAll({
        where: {
            status: 0
        },
        attributes: ['user_id', 'first_name', 'last_name', 'request_amount', 'transaction_number', 'bank_nm', 'acc_number', 'swift_code', 'posted_date', 'id']
    })
    return res.send(requests)
}

// Withdraw request with status 1
exports.close = async (req, res) => {
    let requests = await withdrawRequest.findAll({
        where: {
            status: 1
        },
        attributes: ['user_id', 'first_name', 'last_name', 'request_amount', 'transaction_number', 'acc_name', 'bank_nm', 'acc_number', 'swift_code', 'posted_date']
    })
    return res.send(requests)
}

// Submit withdraw request.
exports.save = async (req, res) => {
   let body = req.body
   body.list.forEach(async b => {
        try {
            await withdrawRequest.update({
                status: 1,
                admin_remark: body.description,
                admin_response_date: new Date().toISOString().split('T')[0]
            }, {
                where: {
                    id: b
                }
            })
            return res.send({
                success: true,
                message: "Withdraw request submitted successfully!"
            })
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
   });
}