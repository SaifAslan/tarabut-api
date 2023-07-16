const { validationResult } = require("express-validator");

const Article = require("../models/article");

// POST /articles
exports.postArticle = async (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) {
    console.log(errors);
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  try {
    const { titleEN, contentEN, titleAR, contentAR } = req.body;

    const titleTranslations = [
      {
        langCode: "ar",
        text: titleAR,
      },
      {
        langCode: "en",
        text: titleEN,
      },
    ];
    const contentTranslations = [
      {
        langCode: "ar",
        text: contentAR,
      },
      {
        langCode: "en",
        text: contentEN,
      },
    ];

    // Create a new article instance with multilingual fields
    const article = new Article({
      title: titleTranslations,
      content: contentTranslations,
    });

    // Save the article to the database
    const savedArticle = await article.save();

    res.status(201).json({
      article: savedArticle,
      message: "Article created successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { skip, limit, langCode } = req.params;
    const articles = await Article.find()
      .skip(skip ?? 0)
      .limit(limit ?? 2)
      .exec();
    const totalCount = await Article.countDocuments();
    res.status(200).json({
      articles,
      totalCount,
      message: "Articles retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getArticle = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) {
      const error = new Error("Article not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      article,
      message: "Article retrieved successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
