const { authJwt, franchiseValidations } = require("../middleware");
const franchiseController = require("../controllers/franchise.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.group("/api/franchisepanel", (router) => {
    router.use([authJwt.verifyToken, authJwt.isVendor]);
    router.get("/", franchiseController.dashboard.index);
    router.get("/profile", franchiseController.dashboard.profile);
    router.post("/profile/update", [franchiseValidations.updateProfile], franchiseController.dashboard.updateProfile);
    router.post("/bank/update", [franchiseValidations.bank], franchiseController.dashboard.updateBank);
    router.post("/logo/update",  franchiseController.dashboard.updateLogo);
    router.post("/gallery/update",  franchiseController.dashboard.updateGallery);

    // Billing Section
    router.get("/invoices/all", franchiseController.billingSection.invoices);
    router.get("/invoice/view/(:invoice_number)", franchiseController.billingSection.viewInvoice);
    router.get("/dues/report", franchiseController.billingSection.duesReport);
    router.post("/invoice/generate", [franchiseValidations.generateInvoice], franchiseController.billingSection.generateInvoice);
    router.get("/user/(:user_id)", franchiseController.billingSection.checkUser);
    router.get("/terms-and-conditions", franchiseController.dashboard.termsAndConditions);
    router.post("/pay-dues", [franchiseValidations.payDues], franchiseController.billingSection.payDues );
    router.put("/pay-dues/(:id)", franchiseController.billingSection.payDuesProof );
  });
};