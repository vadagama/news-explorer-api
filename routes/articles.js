const router = require("express").Router();
const { getArticles, postArticle, deleteArticle } = require("../controllers/articles");

router.get("/", getArticles);
router.post("/", postArticle);
router.delete("/:id", deleteArticle);

module.exports = router;
