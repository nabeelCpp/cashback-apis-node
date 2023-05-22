module.exports = (sequelize, Sequelize) => {
    const video = sequelize.define("video", {
        id : {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title : {
            type: Sequelize.STRING,
            allowNull: false
        },
        description : {
            type: Sequelize.STRING,
            allowNull: false
        },
        video_link : {
            type: Sequelize.STRING,
            allowNull: false
        },
        upload_date : {
            type: Sequelize.STRING,
            allowNull: false
        },
        
    }, {
      tableName: 'video',
      timestamps: false
    });
  
    return video;
  };