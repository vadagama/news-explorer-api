const jwt = require("jsonwebtoken");
const handleAuthError = require("../errors/handle-auth-err");

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new handleAuthError("There is no user with such id");
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    throw new NotFoundError("There is no user with such id");
  }

  req.user = payload; 

  next();
};
