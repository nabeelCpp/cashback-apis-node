module.exports = (sequelize, Sequelize) => {
    const contactDetail = sequelize.define("contactdetail", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        page_name : {
            type: Sequelize.STRING,
            allowNull: false
        },
        description : {
            type: Sequelize.TEXT,
            allowNull: false
        },
        posted_date : {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
      tableName: 'contactdetail',
      timestamps: false
    });
  
    return contactDetail;
  };