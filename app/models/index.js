const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
require('sequelize-values')(Sequelize);

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../models/user.model.js")(sequelize, Sequelize);
db.statusMaintenance = require("../models/statusMaintenance.model.js")(sequelize, Sequelize);
db.matrixDownline = require("../models/matrixDownline.model.js")(sequelize, Sequelize);
db.finalEWallet = require("../models/finalEWallet.model.js")(sequelize, Sequelize);
db.levelEWallet = require("../models/levelEWallet.model.js")(sequelize, Sequelize);
db.amountDetail = require("../models/amountDetail.model.js")(sequelize, Sequelize);
db.lifejacketSubscription = require("../models/lifejacketSubscription.model.js")(sequelize, Sequelize);
db.creditDebit = require("../models/creditDebit.model.js")(sequelize, Sequelize);
db.pucCreditDebit = require("../models/pucCreditDebit.model.js")(sequelize, Sequelize);
db.withdrawRequest = require("../models/withdrawRequest.model.js")(sequelize, Sequelize);
db.venderServices = require("./venderServices.model.js")(sequelize, Sequelize);
db.pocRegistration = require("./pocRegistration.model.js")(sequelize, Sequelize);
db.pocRegisterDetails = require("./pocRegistrationDetail.model.js")(sequelize, Sequelize);
db.manageBvHistory = require("./manageBvHistory.model.js")(sequelize, Sequelize);
db.levelIncomeBinary = require("./levelIncomeBinary.model.js")(sequelize, Sequelize);
db.Tickets = require("./tickets.model.js")(sequelize, Sequelize);
db.Promo = require("./promo.model.js")(sequelize, Sequelize);
db.Admin = require("./admin.model.js")(sequelize, Sequelize);
db.Vendor = require("./vendor.model.js")(sequelize, Sequelize);
db.Country = require("./country.model.js")(sequelize, Sequelize);
db.States = require("./states.model.js")(sequelize, Sequelize);
db.eshopPurchaseDetail = require("./eshopPurchaseDetail.model.js")(sequelize, Sequelize);
db.dueClearRequest = require("./dueClearRequest.model.js")(sequelize, Sequelize);
db.oldUserNames = require("./oldUserNames.model.js")(sequelize, Sequelize);
db.statusMaintenancePuc = require("./statusMaintenancePuc.model.js")(sequelize, Sequelize);
db.closingCreditDebit = require("./closingCreditDebit.model.js")(sequelize, Sequelize);
db.Video = require("./video.model.js")(sequelize, Sequelize);
db.contactDetail = require("./contactDetail.model.js")(sequelize, Sequelize);
module.exports = db;