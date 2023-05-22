module.exports = (sequelize, Sequelize) => {
    const pocRegisterDetails = sequelize.define("poc_register_details", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        poc_userid : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        catogory : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        title : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        
        
    }, {
      tableName: 'poc_register_details',
      timestamps: false
    });
  
    return pocRegisterDetails;
  };