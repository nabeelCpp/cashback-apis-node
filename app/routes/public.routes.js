const publicController = require("../controllers/public.controller");
const franchiseController = require("../controllers/franchise.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.group("/api/", (router) => {
    router.get("/", publicController.index);
    router.get("/countries", publicController.countries);
    router.get("/country/(:id)", publicController.country);
    router.get("/states/(:country_id)", publicController.states);
    router.get("/state/(:id)", publicController.state);

    router.get("/packages", publicController.packages);
    router.get("/vendor/services", publicController.vendorServices);
    router.get("/terms-and-conditions", franchiseController.dashboard.termsAndConditions);
  });
};