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
  upload.single("image"),
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

// router.post("/upload", upload.single("image"), uploaImage);

module.exports = router;
