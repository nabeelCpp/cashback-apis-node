module.exports = (sequelize, Sequelize) => {
    const country = sequelize.define("country", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        iso : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        nicename : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        iso3 : {
            type: Sequelize.STRING,
            allowNull: true
        },
        numcode : {
            type: Sequelize.INTEGER,            
            allowNull: true
        },
        phonecode : {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        
    }, {
      tableName: 'country',
      timestamps: false
    });
  
    return country;
  };