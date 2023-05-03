module.exports = (sequelize, Sequelize) => {
    const venderServices = sequelize.define("vender_services", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        service_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        date : {
            type: Sequelize.DATE,
            allowNull: false
        }
        
    }, {
      tableName: 'vender_services',
      timestamps: false
    });
  
    return venderServices;
  };