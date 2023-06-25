const { authJwt, validations } = require("../middleware");
const userController = require("../controllers/user.controller");
const adminController = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.group("/api/userpanel", (router) => {
    router.use([authJwt.verifyToken, authJwt.isUser]);
    router.get("/", userController.userPanel);
    router.get("/upgrade/plan", userController.upgradePackage.upgradePlan);
    router.get("/plan/history", userController.upgradePackage.planHistory);
    router.get("/wallet-mgt/transactions", userController.walletManagement.transactionHistory);
    router.get("/wallet-mgt/mywallet", userController.walletManagement.myWallet);
    router.get("/wallet-mgt/income-withdrawal", userController.walletManagement.withdrawRequest);
    router.post("/wallet-mgt/income-withdrawal", userController.walletManagement.checkPassword);
    router.post("/wallet-mgt/income-withdrawal/submit", userController.walletManagement.submitWithdrawal);
    router.get("/wallet-mgt/my-withdrawal-requests", userController.walletManagement.myWithdrawalRequests);
    router.get("/vendors", userController.vendors);
    router.get("/genealogy/tree-view", userController.genealogy.treeView);
    router.post("/genealogy/tree-view", [validations.genealogyValidation], userController.genealogy.treeView);
    router.get("/genealogy/downline-members", userController.genealogy.downlineMembers);
    router.get("/genealogy/direct-members", userController.genealogy.directMembers);
    
    router.get("/earning-reports/level-income", userController.earningReports.levelIncome);
    router.get("/earning-reports/cofounder-income", userController.earningReports.coFounderIncome);

    router.get("/invoice/package-purchase", userController.invoice.myPackagePurchase);
    router.get("/invoice/my-shopping", userController.invoice.myShoppingInvoices);
    router.get("/invoice/(:invoice_no)", adminController.vendorMgt.vendorInvoice)

    router.get("/profile", userController.profile.index);
    router.post("/profile", [validations.profile], userController.profile.update);
    router.post("/profile/update/image", userController.profile.updateImage)
    router.post("/bank-info/update", userController.profile.updateBankInfo);
    router.post("/profile/update-password", [validations.updatePassword], userController.profile.updatePassword);
    
    
    router.get("/help-desk/ticket-categories", userController.helpDesk.ticketCategories);
    router.post("/help-desk/open-ticket", [validations.openTicket], userController.helpDesk.openTicket);
    router.get("/help-desk/view-tickets", userController.helpDesk.viewTicket);

    router.get("/official-announcements", userController.officialAnnouncements.index);
    router.get("/official-accouncement/(:id)", userController.officialAnnouncements.view);
  });
};