module.exports = (sequelize, Sequelize) => {
    const promo = sequelize.define("promo", {
        n_id : {
            type: Sequelize.INTEGER, 
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        news_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        n_date : {
            type: Sequelize.DATE,
            
            allowNull: true
        },
        status : {
            type: Sequelize.INTEGER,
            defaultValue: '1', 
            allowNull: false
        },
        read_viewer : {
            type: Sequelize.INTEGER,
            defaultValue: '1', 
            allowNull: false
        },
        posted_date : {
            type: Sequelize.STRING, 
            allowNull: false
        },
    }, {
      tableName: 'promo',
      timestamps: false
    });
  
    return promo;
  };