module.exports = (sequelize, Sequelize) => {
    const states = sequelize.define("states", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name : {
            type: Sequelize.STRING, 
            allowNull: false
        },
        country_id : {
            type: Sequelize.INTEGER,            
            allowNull: true
        },
        
    }, {
      tableName: 'states',
      timestamps: false
    });
  
    return states;
  };