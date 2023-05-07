const db = require("../models");
const config = require("../config/auth.config");
const {User, matrixDownline, finalEWallet, levelEWallet, lifejacketSubscription} = db;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { statusMaintenance } = require("../models");
exports.signup = (req, res) => {
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
                if(req.body.term_cond != 'yes'){
                  return res.status(403).send({
                    message: `Kindly accept terms and conditions!`
                  });
                }else{
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
                          

                          let token = jwt.sign({ id: response.id, role: "user" }, config.secret, {
                            expiresIn: 8886400 // 102 days
                          });
                          return res.status(200).send({
                            success: true,
                            message: "User registered successfully!",
                            data:{
                              id: response.id,
                              username: response.username,
                              email: response.email,
                              first_name: response.first_name,
                              last_name: response.last_name,
                              accessToken: token
                            }
                          });
                      }).catch(err=>{
                        return res.status(501).send({
                          message: err
                        });
                      })
                    }else{
                      return res.status(404).send({
                        message: "Sponsor not available"
                      })
                    }
                  })
                }
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
  }).catch(err=>{
      res.status(500).send({ message: err.message });
  });
  
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      // username: req.body.username
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({ message: "No user found with current details" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if(!passwordIsValid){
        passwordIsValid = req.body.password == user.password ? true : false;
      }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let token = jwt.sign({ id: user.id, role: "user" }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        success: true,
        data:{
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          accessToken: token
        }
      });  
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};