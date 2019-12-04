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
    name,
    link,
    likes,
    createdAt
  } = req.body;
  const owner = req.user;
  Article.create({
      name,
      link,
      owner,
      likes,
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
  Card.findById(req.params.id, function (err, card) {
    if (err) return res.status(500).send("There was a problem deleting the card.");
    const owner = card.owner;
    if (curent_user == owner) {
      res.status(200).send("Card deleted");
    } else {
      res.status(401).send("User not authorized to delete this card");
    }
  });
};

module.exports.deleteCard = (req, res) => {
  const curent_user = req.user._id;

  Card.findById(req.params.id, function (err, card) {
    if (err) return res.status(500).send("There was a problem deleting the card.");
    const owner = card.owner.toString();

    if (curent_user === owner) {
      Card.findByIdAndRemove(req.params.id)
        .then(cards => res.status(200).send("Card deleted"))
        .catch(err => res.status(500).send("User not authorized to delete this card"));
    } else {
      res.status(401).send("User not authorized to delete this card");
    }
  });
};