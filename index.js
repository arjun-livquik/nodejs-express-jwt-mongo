if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const authRoutes = require("./src/routes/auth");
const usersRoutes = require("./src/routes/users");
app.use(cors());
app.use(bodyParser.json());
authRoutes(app);
usersRoutes(app);
app.listen(process.env.PORT, function () {
  console.log(`App listening at port ${process.env.PORT}`);
});
