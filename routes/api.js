const express = require("express");

const { body, param } = require("express-validator");

const {
  postArticle,
  getArticle,
  getArticles,
  uploaImage,
} = require("../controllers/api");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post(
  "/articles",
  [
    body("titleEN").notEmpty().withMessage("Title is required 'EN'"),
    body("contentEN").notEmpty().withMessage("Content is required 'EN'"),
    body("titleAR").notEmpty().withMessage("Title is required 'AR'"),
    body("contentAR").notEmpty().withMessage("Content is required 'AR'"),
  ],
  postArticle
);

// GET /articles
router.get(
  "/articles",
  [param("contentAR").notEmpty().withMessage("langCode is required")],
  getArticles
);

// GET /articles/:id
router.get("/articles/:id", getArticle);

router.post("/upload", upload.single("image"), uploaImage);

module.exports = router;
