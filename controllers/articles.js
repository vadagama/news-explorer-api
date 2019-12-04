const Card = require("../models/article");

module.exports.getArticles = (req, res) => {
  Article.find({})
    .then(article => res.send({
      data: article
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }));
};

module.exports.postArticle = (req, res) => {
  const {
    keyword,
    text,
    date,
    source,
    link,
    image,
    createdAt
  } = req.body;
  const owner = req.user;
  Article.create({
      keyword,
      text,
      date,
      source,
      link,
      image,
      createdAt
    })
    .then(article => res.send({
      data: article
    }))
    .catch(err => res.status(500).send({
      message: err.message
    }));
};

module.exports.deleteArticle = (req, res) => {
  const curent_user = req.user._id;
  Card.findById(req.params.id, function (err, article) {
    if (err) return res.status(500).send("There was a problem deleting the article.");
    const owner = article.owner;
    if (curent_user == owner) {
      res.status(200).send("Card deleted");
    } else {
      res.status(401).send("User not authorized to delete this article");
    }
  });
};