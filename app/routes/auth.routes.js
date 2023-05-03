const { verifySignUp, validations } = require("../middleware");
const controller = require("../controllers/auth.controller");
const adminLoginController = require("../controllers/adminAuth.controller");
const franchiseLoginController = require("../controllers/franchiseAuth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      validations.signupValidation,
      verifySignUp.checkDuplicateUsernameOrEmailOrPhone
    ],
    controller.signup
  );

  app.post("/api/auth/signin", validations.loginValidation, controller.signin);
  app.post("/api/controlpanel/login", validations.adminPanelLogin, adminLoginController.signin);
  app.post("/api/franchisepanel/login",  validations.franchisePanelLogin, franchiseLoginController.signin);
};