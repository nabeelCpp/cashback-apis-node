module.exports = (sequelize, Sequelize) => {
    const pocRegistration = sequelize.define("poc_registration", {
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
        ref_id : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        nom_id : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        stock_point : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        file : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        username : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        password : {
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
        email : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        address : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        location : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        city : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        state : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        country : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        phonecode : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        zipcode : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        telephone : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        admin_status : {
            type: Sequelize.INTEGER,
            defaultValue: '0', 
            allowNull: true
        },
        user_status : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        registration_date : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        t_code : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        sex : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        image : {
            type: Sequelize.TEXT,
            
            allowNull: true
        },
        acc_name : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        ac_no : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        bank_nm : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        branch_nm : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        swift_code : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        ts : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        merried_status : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        last_login_date : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        current_login_date : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        id_card : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        id_no : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        kyc_status : {
            type: Sequelize.INTEGER,
            
            allowNull: true
        },
        payment_status : {
            type: Sequelize.INTEGER,
            
            allowNull: true
        },
        activation_date : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        franchise_category : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        dob : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        lendmark : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        franchise_satus : {
            type: Sequelize.INTEGER,
            defaultValue: '0', 
            allowNull: false
        },
        gst : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.TEXT,
            
            allowNull: true
        },
        cmp_logo : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        commission_percent : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        credit_limit : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        due_amount : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        company_reg_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        
    }, {
      tableName: 'poc_registration',
      timestamps: false
    });
  
    return pocRegistration;
  };