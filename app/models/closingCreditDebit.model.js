module.exports = (sequelize, Sequelize) => {
    const closingCreditDebit = sequelize.define("closing_credit_debit", {
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
        binary_income : {
                type: Sequelize.STRING, 
                allowNull: false
        },
        cofounder_income : {
                type: Sequelize.STRING, 
                allowNull: false
        },
        receive_date : {
                type: Sequelize.STRING, 
                allowNull: false
        },
        bank_ref : {
                type: Sequelize.STRING, 
                allowNull: false
        },
        trans_date : {
                type: Sequelize.STRING, 
                allowNull: false
        },
        
    }, {
      tableName: 'closing_credit_debit',
      timestamps: false
    });
  
    return closingCreditDebit;
  };