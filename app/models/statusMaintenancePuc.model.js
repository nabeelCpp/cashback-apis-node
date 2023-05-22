module.exports = (sequelize, Sequelize) => {
    const statusMaintenancePuc = sequelize.define("status_maintenance_puc", {
        id : {
            type: Sequelize.INTEGER, 
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        binary_bonus : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        capping : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        amount : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        matching : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description : {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        pb : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        sponsor_reward : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        referral : {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        roi_duration : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        residual_income : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        matching_income : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        principal_return : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        roi_days : {
            type: Sequelize.INTEGER,
            
            allowNull: true
        },
        l1 : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        l2 : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        l3 : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        l4 : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        l5 : {
            type: Sequelize.FLOAT,
            defaultValue: '0', 
            allowNull: false
        },
        cofounder_percent : {
            type: Sequelize.FLOAT,
            defaultValue: '0.5', 
            allowNull: false
        },
    }, {
        tableName: 'status_maintenance_puc',
        timestamps: false
    });
  
    return statusMaintenancePuc;
  };