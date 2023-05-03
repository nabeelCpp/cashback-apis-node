module.exports = (sequelize, Sequelize) => {
    const manageBvHistory = sequelize.define("manage_bv_history", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        income_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        downline_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        level : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        bv : {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        position : {
            type: Sequelize.STRING,
            allowNull: false
        },
        description : {
            type: Sequelize.STRING,
            allowNull: false
        },
        date : {
            type: Sequelize.DATE,
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), 
            allowNull: false
        },
        status : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        pair : {
            type: Sequelize.STRING,
            allowNull: false
        },
        after_active : {
            type: Sequelize.DOUBLE,
            defaultValue: '0', 
            allowNull: false
        },
    }, {
      tableName: 'manage_bv_history',
      timestamps: false
    });
  
    return manageBvHistory;
  };