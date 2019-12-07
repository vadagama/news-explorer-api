const Article = require("../models/article");
const NotFoundError = require("../errors/not-found-err");
const AccessDeniedError = require("../errors/access-denied-err");
const AnotherError = require("../errors/another-err");
const errors = require("../helpers/errors");

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      if (articles.length <= 0) {
        throw new NotFoundError(errors.NO_ARTICLES_ERROR);
      } else {
        res.send({ data: articles });
      }
    }).catch(next);
};

module.exports.postArticle = (req, res, next) => {
  const {
    keyword,
    text,
    date,
    source,
    link,
    image
  } = req.body;
  const owner = req.user;
  Article.create({
      keyword,
      text,
      date,
      source,
      link,
      image,
      owner
    })
    .then(article => res.send({
      data: article
    }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const curent_user = req.user._id;

  Article.findById(req.params.id).then((article) =>
  {
    if (!article) {
      throw new NotFoundError(errors.NO_ID_ERROR);
    }
    const owner = article.owner.toString();
    if (curent_user !== owner) {
      throw new AccessDeniedError(errors.ACCESS_DENIED_ERROR);
    } else {
      Article.findByIdAndRemove(req.params.id)
        .then((article) => {
          if (!article) {
            throw new AnotherError(errors.CANT_DELETE_ERROR);
          }
          res.status(200).send("Article deleted");
        })
        .catch(next);
    }
  }).catch(next);
  };