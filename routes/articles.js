const router = require("express").Router();
const { getArticles, postArticle, deleteArticle } = require("../controllers/articles");

router.get("/articles", getArticles);
router.post("/articles", postArticle);
router.delete("/articles/:articleId", deleteArticle);

module.exports = router;
