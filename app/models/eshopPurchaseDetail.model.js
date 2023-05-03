module.exports = (sequelize, Sequelize) => {
    const eshopPurchaseDetail = sequelize.define("eshop_purchase_detail", {
        pd_id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        invoice_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        product_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        user_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        quantity : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        net_price : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        price : {
            type: Sequelize.FLOAT, 
            allowNull: false
        },
        gst : {
            type: Sequelize.DOUBLE,
            defaultValue: '0', 
            allowNull: false
        },
        gst_percent : {
            type: Sequelize.DOUBLE, 
            allowNull: false
        },
        tax : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        shipping : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        discount : {
            type: Sequelize.DOUBLE, 
            allowNull: false
        },
        dp : {
            type: Sequelize.DOUBLE,
            defaultValue: '0', 
            allowNull: false
        },
        purchase_date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        status : {
            type: Sequelize.TINYINT,
            defaultValue: '0', 
            allowNull: false
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        seller_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        
    }, {
      tableName: 'eshop_purchase_detail',
      timestamps: false
    });
  
    return eshopPurchaseDetail;
  };