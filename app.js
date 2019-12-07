const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./helpers/mongo-settings");
const helmet = require("helmet");
const { celebrate, Joi, errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const rateLimiter = require("express-rate-limit");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorMessages = require("./helpers/errors");


const limiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 });

const { PORT = 3000 } = process.env;

const app = express();

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .error(new Error(errorMessages.MAIL_ERROR)),
    password: Joi.string().required().min(5)
      .error(new Error(errorMessages.PASSWORD_ERROR)),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().max(120).email()
      .error(new Error(errorMessages.MAIL_ERROR)),
    password: Joi.string().required().min(5)
      .error(new Error(errorMessages.PASSWORD_ERROR)),
    name: Joi.string().required().min(2).max(30)
      .error(new Error(errorMessages.NAME_ERROR)),
  }),
}), createUser);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/articles", require("./routes/articles"));

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500, message
  } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ?
        "Error on server" :
        message
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});