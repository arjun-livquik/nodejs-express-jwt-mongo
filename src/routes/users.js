const users = require("../controllers/users");
const userValidationWare = require("./middlewares/verifyUser");
const authPermissionWare = require("./middlewares/auth.permission");
const { PERMISSION_LEVEL_ADMIN } = process.env;

module.exports = function (app) {
  app.post("/users", [users.insert]);
  app.get("/users", [
    userValidationWare.validJWTNeeded,
    authPermissionWare.minimumPermissionLevelRequired(
      Number(PERMISSION_LEVEL_ADMIN)
    ),
    users.list,
  ]);
  app.get("/users/profile", [userValidationWare.validJWTNeeded, users.getById]);
};
