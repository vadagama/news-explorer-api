const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const User = require("../models/user");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
    User.findById(req.user._id)
      .then(user => user ? res.send({ data: user }) : res.status(404).send({ "message": "There is no such user" }))
      .catch(next);
  };

module.exports.createUser = (req, res, next) => {
     bcrypt.hash(req.body.password,10)
      .then(hash =>  User.create({ 
        email: req.body.email, 
        password: hash, 
        name: req.body.name }))
      .then((user) => res.status(201).send(user))
      .catch(next);
  };

  module.exports.login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
        .then((user) => {
          const token = jwt.sign({_id: user._id}, "super-strong-secret", { expiresIn: "7d" });
          res.send({ token });
        })
        .catch((err) => {
            res.status(401).send({ message: err.message });
        });
};