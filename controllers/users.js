const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const HandleAuthError = require("../errors/handle-auth-err");
const errors = require("../helpers/errors");
const secret = require("../helpers/secret");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
    User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errors.USER_EXIST_ERROR);
      } else {
        res.send({ data: user });
      }
    }).catch(next);
  };

module.exports.createUser = (req, res, next) => {
     bcrypt.hash(req.body.password,10)
      .then(hash =>  User.create({ 
        email: req.body.email, 
        password: hash, 
        name: req.body.name }))
      .then((user) => res.status(201).send({
        email: user.email,
        name: user.name,
      }))
      .catch(() => {
        next(new HandleAuthError(errors.EMAIL_EXIST_ERROR));
      });
  };

  module.exports.login = (req, res, next) => {
    const { NODE_ENV, JWT_SECRET } = process.env;
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : secret.DEV_KEY, { expiresIn: "7d" });
          res.send({ token });
        })
        .catch(next);
};