const verifyUser = require("../middlewares/verifyUser");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",[verifyUser.checkDuplicateEmail], controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshToken", controller.refreshToken);

};
