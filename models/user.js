const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const errors = require("../helpers/errors");
const validator = require("validator");
const AccessDeniedError = require("../errors/access-denied-err.js");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator(v) {
            return validator.isEmail(v);
          },
          message: () => ErrorMessages.EMAIL_IS_INCORRECT_ERROR,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    }
});

userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email }).select("+password")
      .then((user) => {
        if (!user) {
          throw new AccessDeniedError(errors.WRONG_MAIL_OR_PWD_ERROR);
        }
  
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new AccessDeniedError(errors.WRONG_MAIL_OR_PWD_ERROR);
            }
  
            return user;
          });
      });
  };

module.exports = mongoose.model("user",userSchema);