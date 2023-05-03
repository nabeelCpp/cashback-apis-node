module.exports = (sequelize, Sequelize) => {
    const matrixDownline = sequelize.define("matrix_downline", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        down_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        income_id : {
            type: Sequelize.STRING,
            allowNull: false
        },
        level : {
            type: Sequelize.STRING,
            allowNull: false
        },
        leg : {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        group_type : {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        l_date : {
            type: Sequelize.DATE,
            allowNull: false
        },
        status : {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
      tableName: 'matrix_downline',
      timestamps: false
    });
  
    return matrixDownline;
  };