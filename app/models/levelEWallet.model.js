module.exports = (sequelize, Sequelize) => {
    const levelEWallet = sequelize.define("level_e_wallet", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount : {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        status : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        
    }, {
      tableName: 'level_e_wallet',
      timestamps: false
    });
  
    return levelEWallet;
  };