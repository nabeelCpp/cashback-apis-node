const db = require("../models");
const { Country, States, statusMaintenance, venderServices } = db;

exports.index = async (req, res) => {
    return res.send({
        message: "API is running!"
    })
}

exports.countries = async (req, res) => {
    const countries = await Country.findAll();
    return res.status(200).send(countries);
}

exports.country = async (req, res) => {
    const country = await Country.findByPk(req.params.id);
    return res.status(200).send(country);
}

exports.states = async (req, res) => {
    const states = await States.findAll({
        where: {
            country_id: req.params.country_id,
        }
    });
    return res.status(200).send(states?states:[]);
}

exports.state = async (req, res) => {
    const state = await States.findByPk(req.params.id);
    return res.status(200).send(state?state:[]);
}

exports.errorHandlingFunc = (req, res, error) => {
    return res.status(503).send({
        success: false,
        error: error
    });
}

exports.currentDate = () => {
    const NOW = new Date();
    return NOW.toISOString().split['T'][0];
}

exports.currentDateTime = () => {
    return new Date().toISOString();
}

exports.packages = async (req, res) => {
    let packages = await statusMaintenance.findAll({attributes: ['id', 'name', 'amount']});
    return res.status(200).send(packages)
}

exports.vendorServices = async(req, res) => {
    let services = await venderServices.findAll();
    return res.status(200).send(services);
}

exports.makeid = async (length=10) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

exports.makeidNumeric = async (length=10) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}