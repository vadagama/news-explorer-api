const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/explorer", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(bodyParser.json());

app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/articles", require("./routes/articles"));

app.use(errorLogger);

app.use((req, res) => {
  res.status(404).send({ "message": "Запрашиваемый ресурс не найден" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
      .status(statusCode)
      .send({
          message: statusCode === 500
              ? "На сервере произошла ошибка"
              : message
      });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
