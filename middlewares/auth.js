const jwt = require("jsonwebtoken");
const handleAuthError = require("../errors/handle-auth-err");
const errors = require("../helpers/errors");
const secret = require("../helpers/secret");

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new handleAuthError(errors.AUTH_ERROR);
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === "production" ? JWT_SECRET : secret.DEV_KEY);
  } catch (err) {
    throw new handleAuthError(errors.AUTH_ERROR);
  }

  req.user = payload; 

  next();
};
