module.exports = (sequelize, Sequelize) => {
    const dueClearRequest = sequelize.define("due_clear_request", {
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
            type: Sequelize.STRING,
            allowNull: true
        },
        pay_proof : {
            type: Sequelize.STRING,
            allowNull: false
        },
        status : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        txn_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        payment_mode : {
            type: Sequelize.STRING,
            allowNull: false
        },
        admin_status : {
            type: Sequelize.INTEGER,
            defaultValue: '0', 
            allowNull: false
        },
        admin_remark : {
            type: Sequelize.TEXT,
            
            allowNull: true
        },
        posted_date : {
            type: Sequelize.DATE,
            
            allowNull: true
        },
        admin_date : {
            type: Sequelize.DATE,
            
            allowNull: true
        },
        
    }, {
      tableName: 'due_clear_request',
      timestamps: false
    });
  
    return dueClearRequest;
  };