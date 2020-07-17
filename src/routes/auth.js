const auth = require("../controllers/auth");
const userValidationWare = require("./middlewares/verifyUser");
const authValidationWare = require("./middlewares/auth.validation");
module.exports = (app) => {
  app.post("/login", [
    authValidationWare.hasAuthValidFields,
    authValidationWare.isPasswordAndUserMatch,
    auth.login,
  ]);

  app.post("/refreshToken", [
    userValidationWare.validJWTNeeded,
    userValidationWare.verifyRefreshBodyField,
    userValidationWare.validRefreshNeeded,
    auth.refreshToken,
  ]);
};
