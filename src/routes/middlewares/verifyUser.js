const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = process.env;

exports.verifyRefreshBodyField = (req, res, next) => {
  if (req.body && req.body.refresh_token) {
    return next();
  } else {
    return res.status(400).send({ error: "need to pass refresh_token field" });
  }
};

exports.validRefreshNeeded = (req, res, next) => {
  let b = Buffer.from(req.body.refresh_token, "base64");
  let refresh_token = b.toString();
  let hash = crypto
    .createHmac("sha512", req.jwt.refreshKey)
    .update(`${req.jwt.userId}${JWT_SECRET}`)
    .digest("base64");
  if (hash === refresh_token) {
    req.body = req.jwt;
    return next();
  } else {
    return res.status(400).send({ error: "Invalid refresh token" });
  }
};

exports.validJWTNeeded = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const authorizationArr = authorization.split(" ");
      if (authorizationArr[0] !== "Bearer") {
        return res.status(401).send();
      } else {
        req.jwt = jwt.verify(authorizationArr[1], JWT_SECRET);
        return next();
      }
    } catch (err) {
      console.error(err);
      return res.status(403).send();
    }
  } else {
    return res.status(401).send();
  }
};
