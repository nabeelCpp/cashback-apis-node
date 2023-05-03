module.exports = (sequelize, Sequelize) => {
    const pucCreditDebit = sequelize.define("puc_credit_debit", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        transaction_no : {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        credit_amt : {
            type: Sequelize.STRING,
            allowNull: false
        },
        debit_amt : {
            type: Sequelize.STRING,
            allowNull: false
        },
        admin_charge : {
            type: Sequelize.STRING,
            allowNull: false
        },
        receiver_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        sender_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        receive_date : {
            type: Sequelize.STRING,
            allowNull: false
        },
        ttype : {
            type: Sequelize.STRING,
            allowNull: false
        },
        TranDescription : {
            type: Sequelize.STRING,
            allowNull: false
        },
        Cause : {
            type: Sequelize.STRING,
            allowNull: false
        },
        Remark : {
            type: Sequelize.STRING,
            allowNull: false
        },
        invoice_no : {
            type: Sequelize.STRING,
            allowNull: false
        },
        product_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        status : {
            type: Sequelize.STRING,
            allowNull: false
        },
        ewallet_used_by : {
            type: Sequelize.STRING,
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        current_url : {
            type: Sequelize.STRING,
            allowNull: false
        },
        
    }, {
      tableName: 'puc_credit_debit',
      timestamps: false
    });
  
    return pucCreditDebit;
  };