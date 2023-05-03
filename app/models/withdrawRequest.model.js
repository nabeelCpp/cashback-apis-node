module.exports = (sequelize, Sequelize) => {
    const withdrawRequest = sequelize.define("withdraw_request", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        transaction_number : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        user_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        first_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        last_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        acc_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        acc_number : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        bank_nm : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        branch_nm : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        swift_code : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        request_amount : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        status : {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        posted_date : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        admin_remark : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        admin_response_date : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        withdraw_wallet : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        total_paid_amount : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        transaction_charge : {
            type: Sequelize.STRING, 
            allowNull: false
        },
    }, {
      tableName: 'withdraw_request',
      timestamps: false
    });
  
    return withdrawRequest;
  };