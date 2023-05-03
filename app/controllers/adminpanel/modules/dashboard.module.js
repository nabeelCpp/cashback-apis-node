const db = require('../../../models');
const Op = db.Sequelize.Op;
const {User, amountDetail, creditDebit, withdrawRequest, pocRegistration} = db;
module.exports = async(req, res) => {
    const response = {};
    const usersRegistered = {};
    const NOW = new Date();
    const todayDate = NOW.toISOString().split('T')[0];
    usersRegistered.today = await User.count({
        where: {
            registration_date: { 
                [Op.gt]: `${todayDate} 00:00:00`,
                [Op.lt]: `${todayDate} 11:59:59`
            },
        },
    });
    usersRegistered.thisYear = await User.count({
        where: {
            registration_date: { 
                [Op.gt]: `${NOW.getFullYear()}-01-01 00:00:00`,
                [Op.lt]: `${NOW.getFullYear()}-12-31 11:59:59`
            },
        },
    });

    usersRegistered.thisMonth = await User.count({
        where: {
            registration_date: { 
                [Op.gt]: `${NOW.getFullYear()}-${NOW.getMonth()}-${NOW.getDate()} 00:00:00`,
                [Op.lt]: `${NOW.getFullYear()}-${NOW.getMonth()+1}-${NOW.getDate()} 11:59:59`
            },
        },
    });
    let nextWeek = new Date(NOW.setDate(NOW.getDate() - 1 * 7));
    usersRegistered.thisWeek = await User.count({
        where: {
            registration_date: { 
                [Op.gt]: `${nextWeek.getFullYear()}-${nextWeek.getMonth()+1}-${nextWeek.getDate()} 00:00:00`,
                [Op.lt]: `${NOW.getFullYear()}-${NOW.getMonth()+1}-${NOW.getDate()} 11:59:59`,
            },
        },
    });
    usersRegistered.total = await User.count();
    response.usersRegistered = usersRegistered;
    let totalSales = await amountDetail.sum('total_invoice_cv');
    let salesToday = await amountDetail.sum('total_invoice_cv', {where: {
        purchase_date: todayDate
    }})
    response.sales = {total: totalSales||0, today: salesToday||0}

    const creditDebitFunc = (where, field = 'credit_amt') => {
        return creditDebit.sum(field, { 
          where: where
        }).then(resp=>{
          if(resp){
            return resp;
          }
          return 0;
        })
      }

    // Pending Level Income Distributed
    let pendingLevelIncome = await creditDebitFunc({
        ttype :'Level Income',
        status: 0
    });
    let pendingLevelIncomeToday = await creditDebitFunc({
        ttype :'Level Income',
        status: 0,
        receive_date: todayDate
    });
    response.pendingLevelIncomeDistributed = {
        total: pendingLevelIncome||0,
        today: pendingLevelIncomeToday||0
    }

    // Paid Level Income
    let paidLevelIncome = await creditDebitFunc({
        ttype :'Level Income',
        status: 1
    })
    let paidLevelIncomeToday = await creditDebitFunc({
        ttype :'Level Income',
        status: 1,
        receive_date: todayDate
    });

    response.paidLevelIncomeDistributed = {
        total: paidLevelIncome||0,
        today: paidLevelIncomeToday||0
    }

    // Pending Co-founder Income
    let pendingCoFounderIncome = await creditDebitFunc({
        ttype :'Co-founder Income',
        status: 0
    });
    let pendingCoFounderIncomeToday = await creditDebitFunc({
        ttype :'Co-founder Income',
        status: 0,
        receive_date: todayDate
    });
    response.pendingCoFounderIncomeDistributed = {
        total: pendingCoFounderIncome||0,
        today: pendingCoFounderIncomeToday||0
    }

    // Paid Co-founder Income
    let paidCoFounderIncome = await creditDebitFunc({
        ttype :'Co-founder Income',
        status: 1
    });
    let paidCoFounderIncomeToday = await creditDebitFunc({
        ttype :'Co-founder Income',
        status: 1,
        receive_date: todayDate
    });
    response.paidCoFounderIncomeDistributed = {
        total: paidCoFounderIncome||0,
        today: paidCoFounderIncomeToday||0
    }

    // Pending withdrawal
    let pendingWithdrawal = await withdrawRequest.sum('request_amount', {
        where: {
            status: 0
        }
    });
    let pendingWithdrawalToday = await withdrawRequest.sum('request_amount', {
        where: {
            status: 0,
            posted_date: todayDate
        }
    });
    response.pendingWithdrawal = {
        total: pendingWithdrawal||0,
        today: pendingWithdrawalToday||0
    }

    // Commpany Revenue Till now
    let records = await creditDebit.findAll({
        where: {
            status: 1,
            [Op.or]: [
                {ttype: 'Level Income'},
                {ttype: 'Co-founder Income'},
            ]
        },
        group: [
            ['product_name']
        ]
    });
    let total = 0, grandrevenue = 0, totalcommission = 0;
    for (let i = 0; i < records.length; i++) {
        const rec = records[i];
        let amountAble = await amountDetail.findOne({
            where: {
                invoice_no: rec.product_name
            }
        });
        let seller = await pocRegistration.findOne({
            where: {
                user_id: amountAble.seller_id
            }
        });
        total += amountAble.net_amount;
        let totalAdminCommision = amountAble.net_amount * seller.commission_percent / 100;
        totalcommission += totalAdminCommision;
        grandrevenue += (totalAdminCommision - rec.credit_amt);
    }
    response.company_revenue = grandrevenue;

    // Graphs

    // For members
    const members = (where) => {
        return User.count({ 
          where: where
        }).then(resp=>{
          if(resp){
            return resp;
          }
          return 0;        
        })
    }

    let currentYear = new Date().getFullYear();
    const registeredMembersThisYear = {};
    for (let i = 1; i <= 12; i++) {
        let from = `${currentYear}-${i}-01`;
        let to = `${currentYear}-${i}-31`;
        let temp = await members({
            registration_date: {
                [Op.gte] : from,
                [Op.lte] : to
            }
        });
        let month = new Date(from).toLocaleString('default', {month: 'long'});
        registeredMembersThisYear[month] = temp;
        
        // registeredMembersThisYear.push({});
    }

    // world wide users count
    let sql = "select COUNT(user_registration.id) as total ,country.iso as country_name, country.nicename from user_registration  INNER JOIN country where user_registration.country=country.name GROUP BY country.iso";
    let [wwUsers] = await db.sequelize.query(sql);
    response.graph = [{members: registeredMembersThisYear}, {world_wide_users : wwUsers}]
    return res.send(response);
}