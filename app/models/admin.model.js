module.exports = (sequelize, Sequelize) => {
    const admin = sequelize.define("admin", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id : {
            type: Sequelize.BIGINT, 
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
        password_bcrypt : {
            type: Sequelize.STRING, 
            allowNull: true
        },
        email : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        image : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        type : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        add_date_time : {
            type: 'TIMESTAMP',
            allowNull: false
        },
        last_modify : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        stutus : {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        last_login : {
            type: 'TIMESTAMP', 
            allowNull: false
        },
        last_logout : {
            type: 'TIMESTAMP', 
            allowNull: false
        },
        login_status : {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        website_logo : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        transaction_pwd : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        
    }, {
      tableName: 'admin',
      timestamps: false
    });
  
    return admin;
  };