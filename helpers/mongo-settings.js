const mongoose = require("mongoose");
const mongoAddress = require("./mongo-address");

mongoose.connect(mongoAddress.MONGO_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
