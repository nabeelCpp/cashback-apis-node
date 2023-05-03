const { authJwt, validations } = require("../middleware");
const adminController = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.group("/api/controlpanel", (router) => {
    router.use([authJwt.verifyToken, authJwt.isAdmin]);
    router.get("/", adminController.adminPanel);
    // members list
    router.get("/members/list", adminController.membersMgt.list);
    router.get("/members/list/(:id)", adminController.membersMgt.singleList);
    router.post("/member/update", adminController.membersMgt.update);
    router.put("/member/update/(:id)", [validations.adminPanel.updateMember], adminController.membersMgt.update);
    router.post("/member/create", [validations.signupValidation], adminController.membersMgt.create);
    router.get("/member/genealogy/(:member_id)", adminController.membersMgt.genealogy);
    
    // Vendor list
    router.get("/vendor/list", adminController.vendorMgt.list);
    router.get("/vendor/list/(:id)", adminController.vendorMgt.singleList);
    router.post("/vendor/update", adminController.vendorMgt.update);
    router.put("/vendor/update/(:id)", [validations.adminPanel.updateVendor], adminController.vendorMgt.update);
    router.put("/vendor/update/bankinfo/(:id)", adminController.vendorMgt.update);
    router.put("/vendor/update/gallery/(:id)", adminController.vendorMgt.updateGallery);
    router.put("/vendor/update/logo/(:id)", adminController.vendorMgt.updateLogo);
    router.post("/vendor/create",[validations.adminPanel.createVendor], adminController.vendorMgt.create);
  });
};