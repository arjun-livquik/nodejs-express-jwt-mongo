const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uuid = require("uuid");
const { JWT_SECRET } = process.env;

exports.login = (req, res) => {
  try {
    const refreshId = `${req.body.userId}${JWT_SECRET}`;
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto
      .createHmac("sha512", salt)
      .update(refreshId)
      .digest("base64");
    req.body.refreshKey = salt;
    const accessToken = jwt.sign(req.body, JWT_SECRET);
    const b = Buffer.from(hash);
    const refreshToken = b.toString("base64");
    res.status(201).send({ status: "success", accessToken, refreshToken });
  } catch (err) {
    res.status(500).send({ status: "failed", message: err });
  }
};

exports.refreshToken = (req, res) => {
  try {
    let token = jwt.sign(req.body, JWT_SECRET);
    res.status(201).send({ status: "success", id: token });
  } catch (err) {
    res.status(500).send({ status: "failed", message: err });
  }
};
