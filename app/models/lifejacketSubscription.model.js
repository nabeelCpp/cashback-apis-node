module.exports = (sequelize, Sequelize) => {
    const lifejacketSubscription = sequelize.define("lifejacket_subscription", {
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
        package : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        amount : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        pay_type : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        pin_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        transaction_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        date : {
            type: Sequelize.DATE,
            
            allowNull: true
        },
        expire_date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        remark : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        status : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        invoice_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        lifejacket_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        username : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        sponsor : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        pb : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        sponser_income : {
            type: Sequelize.STRING,
            defaultValue: 0, 
            allowNull: false
        },
        payout_status : {
            type: Sequelize.INTEGER,
            defaultValue: 0, 
            allowNull: false
        },
        invest_type : {
            type: Sequelize.STRING,
            allowNull: true
        },
        cron_date : {
            type: Sequelize.STRING,
            allowNull: true
        },
        after_active : {
            type: Sequelize.DOUBLE,
            defaultValue: 0, 
            allowNull: false
        },
        next_pay : {
            type: Sequelize.DATE,
            allowNull: true
        },
        
    }, {
      tableName: 'lifejacket_subscription',
      timestamps: false
    });
  
    return lifejacketSubscription;
  };