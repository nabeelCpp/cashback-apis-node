const db = require('../../../models');
const Op = db.Sequelize.Op;
const {oldUserNames,matrixDownline, User, amountDetail, finalEWallet, levelEWallet, statusMaintenance, lifejacketSubscription, manageBvHistory} = db;
const publicController = require('../../public.controller');
var bcrypt = require("bcrypt");
// Fetching members list
exports.list = async (req, res) => {
    const data = [];
    const firstLevelMembers = await matrixDownline.findAll({
        where: {
            income_id: 'Emark00001',
            level: 1
        },
        attributes: ['down_id']
    });
    const coFounders = firstLevelMembers.map(fl => fl.down_id);
    const members = await User.findAll({
        attributes: ["user_id", "user_plan","username", "first_name", "last_name", "email", "telephone", "ref_id", "country", "id", "co_founder", "user_status", "registration_date"],
        order: [
            ['id', 'desc']
        ]
    });
    for (let index = 0; index < members.length; index++) {
        const mem = members[index].getValues();
        const package = await statusMaintenance.findByPk(mem.user_plan, {attributes: ["name", "amount"]});
        const sponsor = await User.findOne({
            where: {
                user_id: mem.ref_id
            },
            attributes: ["username"]
        });
        let selfIncome = await amountDetail.sum('total_invoice_cv', {
            where: {
                user_id: mem.user_id
            }
        });
        mem.package = package;
        mem.sponsor = sponsor;
        mem.selfIncome = selfIncome||0;
        mem.isCoFounder = coFounders.includes(mem.user_id);
        data.push(mem);
    }
    return res.status(200).send(data);
}
// Fetching single member
exports.singleList = async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id, {
        attributes: ["ref_id", "user_id", "registration_date", "username", "first_name","last_name", "email", "address", "country", "phonecode", "telephone", "state", "city", "dob", "sex"]
    });
    if(!user){
        return res.status(404).send({
            success: false,
            message: "404 user not found!"
        })
    }
    let sponsor = await User.findOne({
        where: {
            user_id: user.ref_id
        },
        attributes: ["first_name", "last_name"]
    });
    user = user.getValues();
    user.sponsorName = `${sponsor.first_name} ${sponsor.last_name}`;
    return res.send(user);
}
// Updating member details.
exports.update = async (req, res) => {
    let body = req.body;
    let message = "";
    if(req.params.id){
        var where = {
            id: req.params.id
        }
    }else{
        var where = {
            user_id: body.user_id
        }
    }
    let checkUser = await User.count({
        where: where
    });
    if(!checkUser){
        // Fetching user based on user_id if not found
        return res.status(404).send({
            success: false,
            message: "User not found!"
        });
    }
    // action inside body means which status to update, either cofounder or user login status.
    if(body.action == 'update-cofounder-status'){
        try {
            User.update({
                co_founder: body.status
            },{
                where: {
                    user_id: body.user_id
                }
            });
            message = "Co-founder status updated successfully!";
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }

    if(body.action == 'update-user-status'){
        try {
            User.update({
                user_status: body.status
            },{
                where: {
                    user_id: body.user_id
                }
            });
            message = "User status updated successfully!";
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }
    // Update basic profile details
    if(body.action == 'update-profile'){
        let id = req.params.id;
        try {
            let user = await User.findByPk(id);
            user = user.getValues();
            if(!user){
                return res.status(404).send({
                    success: false,
                    message: "404 user not found!"
                })
            }
            if(user.username != body.username ){
                // Check username already exists
                const checkUsername = await User.count({
                    where: {
                        username: body.username
                    }
                });
                if(checkUsername){
                    return res.status(406).send({
                        success: false,
                        message: "Username already exists!",
                    });
                }else{
                    oldUserNames.create({
                        'user_id': user.user_id,
                        'oldusername': user.username,
                        'newusername': body.username
                    });
                }
            }
            const editAbles = ["first_name", "last_name", "username", "email", "address", "country", "phonecode", "telephone", "state", "city", "dob", "sex", "password", "t_code"];
            let updateUser = {};
            editAbles.forEach(ea => {
                updateUser[ea] = body[ea]||user[ea];
            });
            User.update(updateUser, {
                where: {
                    id: user.id
                }
            });
            return res.send({
                success: true,
                message: "Profile Information Updated Successfully!"
            });
        } catch (error) {
            return publicController.errorHandlingFunc(req, res, error.message);
        }
    }

    return res.send({
        success: true,
        message: message
    });
}
// Create user.
exports.create = async (req, res) => {
    statusMaintenance.findByPk(req.body.platform).then(async (planData)=>{
        if(planData){
          req.body.amount = planData.amount;
          if(req.body.sponsorid){
            if(req.body.username.match(/[\'^£$%&*()}{@#~?><>,|=_+¬-]/)){
              return res.status(403).send({
                message: "Username does not accept special characters"
              });
            }else{
              if(req.body.sponsorid == 'Emarketing' || req.body.sponsorid == "Emark00001"){
                return res.status(403).send({
                  message: `"${req.body.sponsorid}" Sponsor Id cannot be used for registration !`
                })
              }else{
                // check username already exists?
                let userCheck = await User.count({
                    where: {
                        username: req.body.username
                    }
                });
                if(userCheck){
                    return res.status(500).send({
                        message: "username already exist!"
                    })
                }
                if(req.body.password == req.body.confirm_password){
                  req.body.password = bcrypt.hashSync(req.body.password, 12);
                  if(req.email == req.confirm_email){
                    // if(req.body.term_cond != 'yes'){
                    //   return res.status(403).send({
                    //     message: `Kindly accept terms and conditions!`
                    //   });
                    // }else{
                      User.findOne({
                          where:{
                            [Op.or]: [
                              {
                                username: req.body.sponsorid,
                              },
                              {
                                user_id: req.body.sponsorid,
                              }
                            ]
                          }
                      }).then(async (sponsor)=>{
                        if(sponsor){
                          req.body.ip = req.ip
                          // req.body.token = Math.floor(Math.random()*10000000000);
                          // req.body.user_id = async ()=>await generateUserId()
                          const generateUserId = async () => {
                            let user_id = "Emark"+String(Math.floor(Math.random()*100000)).padStart(5, 0);
                            const users = await User.findAll({where: {user_id: user_id}});
                            if(!users.length){
                              return user_id;
                            }else{
                              generateUserId();
                            }
                          }
                          req.body.user_id = await generateUserId();
                          const insert = {
                            user_id: req.body.user_id,
                            first_name: req.body.firstname,
                            last_name: req.body.lastname,
                            ref_id: sponsor.user_id,
                            nom_id: sponsor.user_id,
                            username: req.body.username,
                            password: req.body.password,
                            email: req.body.email,
                            telephone: req.body.mobile,
                            country: req.body.country,
                            phonecode: req.body.phonecode,
                            admin_status: 0,
                            user_status: 0,
                            designation: "Free User",
                            user_rank_name: "Free User",
                            user_rank_name: "Free User",
                            user_plan: req.body.platform
                          }
                          User.create(insert).then(async (response)=>{
                              // Matrix Downline
                              var nom = sponsor.user_id;
                              let level = 1;
                              while (nom != 'cmp') {
                                console.log(nom);
                                if(nom != 'cmp'){
                                  await matrixDownline.create({
                                    down_id: response.user_id,
                                    income_id: nom,
                                    l_date: new Date(Date.now()).toISOString(),
                                    status: 0,
                                    level:level
                                  });
                                  level++;
                                  let user = await User.findOne({
                                    where: {
                                      user_id: nom
                                    },
                                    attributes: ['ref_id']
                                  });
                                  nom = user.ref_id
                                }
                              }
                              finalEWallet.create({
                                user_id : response.user_id,
                                amount: 0,
                                status: 0
                              })
                              levelEWallet.create({
                                user_id : response.user_id,
                                amount: 0,
                                status: 0
                              });
                              let invoice_no  = `${response.user_id}${String(Math.floor(Math.random()*1000000)).padStart(7, 0)}`;
                              lifejacketSubscription.create({
                                user_id: response.user_id,
                                package: req.body.platform,
                                amount: planData.amount,
                                pay_type: 'E Wallet',
                                pin_no: '123456',
                                transaction_no: invoice_no,
                                date: new Date().toISOString().split('T')[0],
                                expire_date: new Date(new Date().setDate(new Date().getDate() + 7300)),
                                remark: 'Package Purchase',
                                status: 'Active',
                                invoice_no: invoice_no,
                                lifejacket_id: "LJ"+invoice_no,
                                username: response.user_id,
                                sponsor:  sponsor.user_id,
                                pb: planData.capping
                              });
                              
    
                            //   let token = jwt.sign({ id: response.id, role: "user" }, config.secret, {
                            //     expiresIn: 86400 // 24 hours
                            //   });
                              return res.status(200).send({
                                success: true,
                                message: "User registered successfully!",
                                data:{
                                  id: response.id,
                                  username: response.username,
                                  email: response.email,
                                  first_name: response.first_name,
                                  last_name: response.last_name,
                                //   accessToken: token
                                }
                              });
                          }).catch(error=>{
                            return publicController.errorHandlingFunc(req, res, error.message);
                          })
                        }else{
                          return res.status(404).send({
                            message: "Sponsor not available"
                          })
                        }
                      })
                    // }
                  }else{
                    return res.status(403).send({
                      message: `Email and confirm email doesnot match!`
                    })  
                  }
                }else{
                  return res.status(403).send({
                    message: `Password and confirm password doesnot match!`
                  })
                }
              }
            }
          }else{
            return res.status(404).send({
              message: "Sponsor not available",
            })
          }
        }else{
          res.status(404).send({
            message: "Not valid platform"
          })
        }
    }).catch(error=>{
        return publicController.errorHandlingFunc(req, res, error.message);
    });
}
// Fetch tree based on user id.
exports.genealogy = async (req, res) => {
    const data = {};
    let memberId = req.params.member_id;
    if(!memberId){
        return res.status(403).send({
            success: false,
            message: "Member id is required!"
        });
    }
    // fetch user based on user id
    let user = await User.findOne({
        where: {
            user_id: memberId
        }
    });
    if(!user){
        return res.status(404).send({
            success: false,
            message: "No User id found!"
        });
    }
    data.image = `${process.env.BASE_URL}/userpanel/images/business-man.svg`;
    data.name = `${user.first_name} ${user.last_name}`;
    data.username = user.username;
    data.joining = user.registration_date;
    data.user_id = user.user_id;
    data.ref_id = user.ref_id;
    data.tree = await User.findAll({
        where: {
            ref_id: user.user_id,
        },
        attributes: ["sex","first_name","last_name","user_id","ref_id","username","group_type","user_rank_name","registration_date","user_plan"]
    });
    return res.status(200).send(data);

}
// Transfer balance to user.
exports.topup = async (req, res) => {
  let user_id = req.params.member_id
  let body = req.body
  if(body.amount > 0){
    // update user
    await User.update({
      power_leg_business: db.sequelize.literal(`power_leg_business + ${body.amount}`),
    }, {
      where: {
        user_id: user_id
      }
    })
    let user = await User.findOne({
      where: {
        user_id: user_id
      },
      attributes: ['power_leg_business']
    })
    let selfPoweLegBusiness = user.power_leg_business
    let selfBussiness = await lifejacketSubscription.sum('after_active', {
      where: {
        user_id: user_id
      }
    })
    let downBussiness = await manageBvHistory.sum('bv', {
      where : {
        income_id: user_id
      }
    })

    let totalEarning = selfBussiness + downBussiness + selfPoweLegBusiness
    let rank = null
    let slab = null
    let rankname = null
    if(totalEarning >=0 && totalEarning < 1000){
        rank = 2;
        slab = 5;
        rankname = 'Beginner';
    }else if(totalEarning >=1000 && totalEarning< 4000){
        rank = 3;
        slab = 7;
        rankname = 'Starter';
    }else if(totalEarning >=4000 && totalEarning< 20000){
        rank = 4;
        slab = 9;
        rankname = 'Associate';
    }else if(totalEarning >=20000 && totalEarning< 50000){
        rank = 5;
        slab = 11;
        rankname = 'Sr. Associate';
    }else if(totalEarning >=50000 && totalEarning< 100000){
        rank = 6;
        slab = 12.5;
        rankname = 'Adviser';
    }else if(totalEarning >=100000 && totalEarning< 500000){
        rank = 7;
        slab = 14;
        rankname = 'Sr. Adviser';
    }else if(totalEarning >=500000 && totalEarning< 1000000){
        rank = 8;
        slab = 15.5;
        rankname = 'Director';
    }else if(totalEarning >=1000000 && totalEarning< 2000000){
        rank = 9;
        slab = 17;
        rankname = 'Sr. Director';
    }else if(totalEarning >=2000000 && totalEarning< 5000000){
        rank = 10;
        slab = 18;
        rankname = 'Star Director';
    }else if(totalEarning >=5000000 && totalEarning< 10000000){
        rank = 11;
        slab = 19;
        rankname = 'Sr. Star Director';
    }else if(totalEarning >=10000000){
        rank = 12;
        slab = 20;
        rankname = 'SuperStar Director';
    }
    User.update({
      slab: slab,
      rank: rank,
      active_status: 1
    }, {
      where: {
        user_id: user_id
      }
    })
    return res.send({
      success: true,
      message: "Topped Up successfully"
    })
  }else{
    return res.status(500).send({
      success: false,
      message: 'Amount must be greater than 0'
    })
  }
}