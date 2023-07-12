const { authJwt, validations } = require("../middleware")
const adminController = require("../controllers/admin.controller")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    )
    next()
  })

  app.group("/api/controlpanel", (router) => {
    router.use([authJwt.verifyToken, authJwt.isAdmin])
    router.get("/", adminController.adminPanel)
    // members list
    router.get("/members/list", adminController.membersMgt.list)
    router.get("/members/list/(:id)", adminController.membersMgt.singleList)
    router.post("/member/update", adminController.membersMgt.update)
    router.put("/member/update/(:id)", [validations.adminPanel.updateMember], adminController.membersMgt.update)
    router.post("/member/create", [validations.signupValidation], adminController.membersMgt.create)
    router.get("/member/genealogy/(:member_id)", adminController.membersMgt.genealogy)
    router.put("/member/topup/(:member_id)", adminController.membersMgt.topup)
    
    // Vendor list
    router.get("/vendor/list", adminController.vendorMgt.list)
    router.get("/vendor/list/(:id)", adminController.vendorMgt.singleList)
    router.post("/vendor/update", adminController.vendorMgt.update)
    router.put("/vendor/update/(:id)", [validations.adminPanel.updateVendor], adminController.vendorMgt.update)
    router.put("/vendor/update/bankinfo/(:id)", adminController.vendorMgt.update)
    router.put("/vendor/update/gallery/(:id)", adminController.vendorMgt.updateGallery)
    router.put("/vendor/update/logo/(:id)", adminController.vendorMgt.updateLogo)
    router.post("/vendor/create",[validations.adminPanel.createVendor], adminController.vendorMgt.create)
    router.get("/vendor/payment-request-report", adminController.vendorMgt.paymentRequestReport)
    router.get("/vendor/payment-request/approve/(:id)/(:status)", adminController.vendorMgt.approvePaymentRequest)
    router.put("/vendor/payment-request/reject/(:id)", adminController.vendorMgt.rejectPaymentRequest)
    router.get("/vendor/sales-report", adminController.vendorMgt.salesReport)
    router.get("/vendor/sales-report/(:user_id)", adminController.vendorMgt.salesReportSingle)
    router.get("/vendor/invoices", adminController.vendorMgt.vendorInvoices)
    router.get("/vendor/invoices/(:invoice_no)", adminController.vendorMgt.vendorInvoice)
    router.get("/vendor/services", adminController.vendorMgt.services)
    router.delete("/vendor/services/(:id)", adminController.vendorMgt.deleteService)
    router.post("/vendor/services", validations.adminPanel.createService, adminController.vendorMgt.createService)
    router.get("/vendor/our-vendors", adminController.vendorMgt.ourVendors)
    router.get("/vendor/our-vendors/history/(:user_id)", adminController.vendorMgt.ourVendorsHistory)

    
    // Revenue Report
    router.get("/admin-revenue/report", adminController.adminRevenueReport)
    // Commision Mgt
    router.get("/commision-mgt", adminController.commisionMgt.index)
    router.post("/commision-mgt/(:id)", adminController.commisionMgt.update)

    // Reports Management
    router.get("/report-management/member-package", adminController.reportManagement.memberPackage)
    router.get("/report-management/paid-level-bonus", adminController.reportManagement.paidLevelBonus)
    router.get("/report-management/unpaid-level-bonus", adminController.reportManagement.unPaidLevelBonus)
    router.get("/report-management/paid-cofounder-income", adminController.reportManagement.paidCofounderIncome)
    router.get("/report-management/unpaid-cofounder-income", adminController.reportManagement.unPaidCofounderIncome)

    // User wallet management
    router.get("/wallet/users", adminController.walletManagement.users)
    router.post("/wallet/user/manage", [validations.adminPanel.walletManagement], adminController.walletManagement.manage)
    router.get("/wallet/user/history/(:user_id)", adminController.walletManagement.ewalletHistory)

    // Payout management
    router.get("/payout-mgt/generate-payout-list", adminController.payoutManagement.generatePayoutList)
    router.post("/payout-mgt/generate-payout-list", validations.adminPanel.generatePayout ,adminController.payoutManagement.generatePayout)
    router.get("/payout-mgt/closing-report", adminController.payoutManagement.closingReport)
    router.get("/payout-mgt/all-payout-list", adminController.payoutManagement.allPayout)

    // Withdrawal Request Management
    router.get("/withdrawal-request/open", adminController.withDrawalRequest.open)
    router.get("/withdrawal-request/close", adminController.withDrawalRequest.close)
    router.post("/withdrawal-request/open", validations.adminPanel.saveWithdrawalRequest, adminController.withDrawalRequest.save)

    // Query Tickets management
    router.get("/tickets", adminController.tickets.index)
    router.get("/tickets/closed", adminController.tickets.closedTickets)
    router.get("/tickets/(:id)", adminController.tickets.index)
    router.put("/tickets/(:id)", validations.adminPanel.ticketResponse, adminController.tickets.saveResponse)
    router.delete("/tickets/(:id)", adminController.tickets.deleteTicket)
    

    // Settings Management
    router.post("/settings/password", adminController.adminSettings.password)
    router.post("/settings/profile-picture", adminController.adminSettings.profileImage)
    router.get("/settings/policy-content", adminController.adminSettings.policyContent)
    router.get("/settings/policy-content/(:id)", adminController.adminSettings.policyContent)
    router.post("/settings/policy-content/(:id)", validations.adminPanel.policyContent, adminController.adminSettings.updatePolicyContent)
    router.put("/settings/user-block/(:user_id)", validations.adminPanel.userBlock, adminController.adminSettings.blockManagement)
    router.put("/settings/user-withdraw-block/(:user_id)", validations.adminPanel.userWithdrawBlock, adminController.adminSettings.userWithdrawBlock)
    router.get("/profile", adminController.adminSettings.getProfile)
    // Videos
    router.get("/videos", adminController.manageVideos.index)
    router.post("/videos", validations.adminPanel.createVideos, adminController.manageVideos.create)
    router.put("/video/(:id)", validations.adminPanel.createVideos, adminController.manageVideos.update)
    router.delete("/video/(:id)", adminController.manageVideos.delete)

    // Official Annoucement
    router.get("/official-annoucement", adminController.officialAnnoucement.index)
    router.post("/official-annoucement", validations.adminPanel.createOfficialAnnoucement, adminController.officialAnnoucement.create)
    router.put("/official-annoucement/(:id)", validations.adminPanel.createOfficialAnnoucement, adminController.officialAnnoucement.update)
    router.delete("/official-annoucement/(:id)", adminController.officialAnnoucement.delete)

    // member login via user id
    router.get("/member/login/(:user_id)", adminController.backOffice.memberAuth)
    router.get("/vendor/login/(:user_id)", adminController.backOffice.vendorAuth)
    // check user id
    router.get("/checkuser/(:userid)", adminController.membersMgt.checkUserId );

  })
}