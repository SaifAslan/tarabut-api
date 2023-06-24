const express = require("express");

const { body } = require("express-validator");

const { postArticle, getArticle, getArticles } = require("../controllers/api");

const router = express.Router();

router.post(
  "/articles",
  [
    body("title").notEmpty().withMessage("Title is required"),
    // body("author").notEmpty().withMessage("Author is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  postArticle
);

// GET /articles
router.get('/articles', getArticles);

// GET /articles/:id
router.get('/articles/:id', getArticle);


module.exports = router;
