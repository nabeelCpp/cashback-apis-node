const db = require("../../../models");
const {User, lifejacketSubscription, manageBvHistory, levelIncomeBinary, matrixDownline} = db;
const Op = db.Sequelize.Op;
exports.treeView = async (req, res) => {
    const data = {};
    var loggedInUser = req.user.user_id;
    data.referrals = await User.count({
        where: {
            ref_id: req.user.user_id
        }
    });
    const rootUser = await User.findOne({
        where: {
            [Op.or]: [
                {
                    user_id: req.body.user_id?req.body.user_id:req.user.user_id,
                },
                {
                    username: req.body.user_id?req.body.user_id:req.user.user_id, 
                }
            ]
        }
    });
    req.user.user_id = !rootUser&&req.body.user_id?'':(rootUser?rootUser.user_id:req.user.user_id);
    if(!req.user.user_id){
        return res.status(404).send({
            message: 'No user Found!'
        })
    }
    const selfIncome = await lifejacketSubscription.sum('after_active', {where:{ user_id: req.user.user_id }});
    const powerLegEarning = await User.findOne({
        where: {
            user_id: req.user.user_id
        },
        attributes: ['power_leg_business']
    });
    let selfBussiness = parseInt(selfIncome) + parseInt(powerLegEarning.power_leg_business);
    let myDownLineIncome = await manageBvHistory.sum('after_active', {where:{income_id: req.user.user_id}});
    let tpv = selfBussiness+myDownLineIncome;
    // let beforeActivation = await manageBvHistory.sum('bv', {where:{income_id: req.user.user_id}});
    // let checkUsersCount = 0;
    // if(loggedInUser != req.user.user_id){
    //     checkUsersCount = await levelIncomeBinary.count({
    //         where: {
    //             down_id: req.user.user_id,
    //             income_id: loggedInUser
    //         }
    //     });
    // }else{
    //     checkUsersCount = 1;
    // }
    // if(!checkUsersCount){
    //     return res.status(403).send({
    //         message: 'Sorry this user not come under your downline'
    //     });
    // }
    data.root = {
        user_id: rootUser.user_id,
        user_rank_name: rootUser.user_rank_name,
        image: `${process.env.BASE_URL}/userpanel/images/male.jpg`,
        first_name: rootUser.first_name,
        last_name: rootUser.last_name,
        country: rootUser.country,
        ref_id: rootUser.ref_id,
        ref_id: rootUser.ref_id,
        selfBussiness: selfBussiness,
        teamBussiness: tpv,
    }
    const referralUsers = await User.findAll({
        where: {
            ref_id: rootUser.user_id
        },
        attributes: ['user_id', 'user_rank_name', 'first_name', 'last_name','username', 'country', 'ref_id', 'power_leg_business']
    });
    const tree = [];
    for (let i = 0; i < referralUsers.length; i++) {
        const refUsers = referralUsers[i];
        let selfIncome = await lifejacketSubscription.sum('after_active', {
            where: {
                user_id: refUsers.user_id,
            }
        });
        let powerLegEarning = refUsers.power_leg_business;
        let selfBussiness = parseInt(selfIncome) + parseInt(powerLegEarning);

        let downBussiness = await manageBvHistory.sum('after_active', { where : { income_id: refUsers.user_id }});
        let tpv = parseInt(selfBussiness) + parseInt(downBussiness?downBussiness:0);
        const temp = {
            user_id: refUsers.user_id,
            user_rank_name: refUsers.user_rank_name,
            image: `${process.env.BASE_URL}/userpanel/images/male.jpg`,
            first_name: refUsers.first_name,
            last_name: refUsers.last_name,
            country: refUsers.country,
            ref_id: refUsers.ref_id,
            ref_id: refUsers.ref_id,
            selfBussiness: selfBussiness,
            teamBussiness: tpv,
        }
        tree.push(temp);
    }
    data.tree = tree;
    
    
    return res.status(200).send(data);
};

exports.downlineMembers = async (req, res) => {
    const [results, metadata] = await db.sequelize.query(
        `SELECT matrix_downline.down_id,matrix_downline.income_id,matrix_downline.level,
        matrix_downline.l_date,matrix_downline.status,user_registration.username,user_registration.first_name,
        user_registration.last_name,user_registration.ref_id,user_registration.user_rank_name,
        user_registration.rank,user_registration.registration_date 
        FROM matrix_downline 
        INNER JOIN user_registration on matrix_downline.down_id=user_registration.user_id 
        WHERE matrix_downline.income_id='${req.user.user_id}'`
    );
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        result.amount = await lifejacketSubscription.sum("amount", {
            where: {
                user_id: result.down_id
            }
        });
        
    }
    return res.status(200).send(results);
}

exports.directMembers = async (req, res) => {
    const users = await User.findAll({
        where : {
            ref_id: req.user.user_id
        },
        attributes: ['user_id', 'first_name', 'last_name', 'registration_date']
    });
    const data = [];
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let amount = await lifejacketSubscription.sum('amount', {
            where: {
                user_id: user.user_id
            }
        });
        const temp = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            amount: amount,
            registration_date: user.registration_date
        }
        data.push(temp);
        
    }

    res.status(200).send(data);

}