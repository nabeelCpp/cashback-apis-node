module.exports = (sequelize, Sequelize) => {
    const levelIncomeBinary = sequelize.define("level_income_binary", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        down_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        income_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        leg : {
            type: Sequelize.STRING,
            allowNull: false
        },
        level : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        l_date : {
            type: Sequelize.DATE,
            allowNull: false
        },
        status : {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        
    }, {
      tableName: 'level_income_binary',
      timestamps: false
    });
  
    return levelIncomeBinary;
  };