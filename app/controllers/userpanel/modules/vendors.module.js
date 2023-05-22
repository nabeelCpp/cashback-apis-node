const db = require("../../../models");
const {venderServices, pocRegistration, pocRegisterDetails} = db;
const Op = db.Sequelize.Op;
module.exports = async (req, res) => {
    let vendors = await venderServices.findAll();
    let companies = await pocRegistration.findAll({
        where: {
            franchise_category: {
                [Op.ne] : 'Master Franchise'
            }
        },
        attributes: ['file', 'user_id', 'first_name', 'last_name', 'telephone', 'address', 'id', ]
    });
    let categories = await pocRegisterDetails.findAll();
    for (let index = 0; index < companies.length; index++) {
        companies[index]['file'] = companies[index]['file'].split(',').map(f=>`${process.env.BASE_URL}/uploads/${f}`); 
        
    }
    return res.status(200).send({
        vendors: vendors,
        categories: categories,
        companies: companies
    })
};