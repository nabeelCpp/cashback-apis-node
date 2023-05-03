module.exports = (sequelize, Sequelize) => {
    const tickets = sequelize.define("tickets", {
        id : {
            type: Sequelize.INTEGER, 
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        subject : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        tasktype : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        detail_desc : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        response_email : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        priority : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        status : {
            type: Sequelize.INTEGER,
            defaultValue: '0', 
            allowNull: false
        },
        t_date : {
            type: Sequelize.DATE, 
            allowNull: false
        },
        c_t_date : {
            type: Sequelize.DATE,
            
            allowNull: true
        },
        response : {
            type: Sequelize.STRING,
            
            allowNull: true
        },
        user_name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        ticket_no : {
            type: Sequelize.STRING, 
            allowNull: false
        },
    }, {
      tableName: 'tickets',
      timestamps: false
    });
  
    return tickets;
  };