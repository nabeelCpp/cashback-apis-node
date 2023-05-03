module.exports = (sequelize, Sequelize) => {
    const amountDetail = sequelize.define("amount_detail", {
        am_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        seller_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        total_invoice_cv : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        invoice_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        net_amount : {
            type: Sequelize.FLOAT, 
            allowNull: false
        },
        discount : {
            type: Sequelize.FLOAT, 
            allowNull: false
        },
        total_amount : {
            type: Sequelize.FLOAT, 
            allowNull: false
        },
        payment_date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        status : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        shipping_charge : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        tax : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        payment_type : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        shipping_status : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        purchase_date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        date : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        
    }, {
      tableName: 'amount_detail',
      timestamps: false
    });
  
    return amountDetail;
  };