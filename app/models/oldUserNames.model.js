module.exports = (sequelize, Sequelize) => {
    const oldUserNames = sequelize.define("olduser_names", {
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
        oldusername : {
            type: Sequelize.STRING,
            allowNull: false
        },
        newusername : {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at : {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    }, {
      tableName: 'olduser_names',
      timestamps: false
    });
  
    return oldUserNames;
  };