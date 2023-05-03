module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user_registration", {
      id : {
        type: Sequelize.INTEGER, 
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ref_id : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      nom_id : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      username : {
        type: Sequelize.STRING, 
        allowNull: true,
        unique: true
      },
      password : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      first_name : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      last_name : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      email : {
        type: Sequelize.STRING, 
        allowNull: true,
        unique: true,
      },
      address : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      city : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      state : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      country : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      phonecode : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      zipcode : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      telephone : {
        type: Sequelize.STRING, 
        allowNull: true,
        unique: true,
      },
      admin_status : {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      user_status : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      registration_date : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      t_code : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      user_plan : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      designation : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      aboutus : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      dob : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      sex : {
        type: Sequelize.STRING, 
        allowNull: true
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
      ltc_add : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      etc_add : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      user_rank_name : {
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
      binary_pos : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      id_card : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      id_status : {
        type: Sequelize.INTEGER(1), 
        allowNull: true
      },
      master_account : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      issued : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      product_type : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      issue_date : {
        type: Sequelize.DATE, 
        allowNull: true
      },
      admin_remark1 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      withdraw_status : {
        type: Sequelize.STRING, 
        defaultValue: '0',
        allowNull: false
      },
      fund_status : {
        type: Sequelize.STRING, 
        defaultValue: '0',
        allowNull: false
      },
      id_no : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      kyc_status : {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      first_pair_status : {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      update_status : {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      btc_add : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      user_acc_no : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ref_leg : {
        type: Sequelize.INTEGER, 
        defaultValue: 0,
        allowNull: false
      },
      group_type : {
        type: Sequelize.STRING, 
        defaultValue: '0',
        allowNull: false
      },
      start_date_award1 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      end_date_award1 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      start_date_award2 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      end_date_award2 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      start_date_award3 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      end_date_award3 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      start_date_award4 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      end_date_award4 : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      tether_address : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      secret : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      two_way : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      rank : {
        type: Sequelize.INTEGER, 
        defaultValue: 1,
        allowNull: false
      },
      ben_fullname : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ben_bank : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ben_acc_no : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ben_nric : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ben_acc_pin : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      ben_wallet_id : {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      ben_perfect_money : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      pin : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      slab : {
        type: Sequelize.STRING, 
        allowNull: true
      },
      active_status : {
        type: Sequelize.INTEGER, 
        defaultValue: 0,
        allowNull: false
      },
      power_leg_business : {
        type: Sequelize.DOUBLE, 
        defaultValue: 0,
        allowNull: false
      },
      trx_address : {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      co_founder : {
        type: Sequelize.INTEGER, 
        defaultValue: 0,
        allowNull: true
      },
      bank_state : {
        type: Sequelize.STRING, 
        allowNull: true
      }
    }, {
      tableName: 'user_registration',
      timestamps: false,
      paranoid: true,
      underscored: true,
    });
  
    return User;
  };