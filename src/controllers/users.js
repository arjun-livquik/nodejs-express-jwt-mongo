const UserModel = require("../models/users");
const crypto = require("crypto");

exports.insert = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findByEmail(email);
  if (user.length) {
    return res
      .status(400)
      .send({ status: "failed", message: "User already registered" });
  }
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 1;
  UserModel.createUser(req.body).then((result) => {
    res.status(201).send({
      status: "success",
      message: "User Created Successfully",
      id: result._id,
    });
  });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  UserModel.findById(req.jwt.userId)
    .then((result) => {
      if (Object.keys(result).length) {
        result = result.toJSON();
        delete result.password;
        delete result._id;
        delete result.__v;
        res.status(200).send(result);
        return;
      }
      res.status(404).send({
        message: "Sorry, Cannot fetch your details currently",
        status: "failed",
      });
    })
    .catch((err) => {
      res.status(404).send({
        message: "Sorry, Cannot fetch your details currently",
        status: "failed",
      });
    });
};

exports.patchById = (req, res) => {
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }

  UserModel.patchUser(req.params.userId, req.body).then((result) => {
    res.status(204).send({});
  });
};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId).then((result) => {
    res.status(204).send({});
  });
};
