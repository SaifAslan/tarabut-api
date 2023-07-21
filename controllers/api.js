const { validationResult } = require("express-validator");

const Article = require("../models/article");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Image = require("../models/image");
const { v4: uuidv4 } = require("uuid");

const s3Client = new S3Client({
  endpoint: "https://ams3.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
  region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// POST /articles
exports.postArticle = async (req, res, next) => {
  // const errors = validationResult(req).errors;
  // if (errors.length > 0) {
  //   console.log(errors);
  //   const error = new Error("Validation failed, entered data is incorrect");
  //   error.statusCode = 422;
  //   throw error;
  // }

  try {
   // Retrieve the uploaded image file
   const file = req.file;

   // Generate a unique filename
   const filename = `${uuidv4()}-${file.originalname}`;

   // Create the parameters for S3 upload
   const uploadParams = {
     Bucket: "tarabut-files",
     Key: filename,
     Body: file.buffer,
     ACL: "public-read", // Optional: Specify ACL for the uploaded file
   };

   // Upload the file to DigitalOcean Spaces using AWS SDK v3
   const uploadCommand = new PutObjectCommand(uploadParams);
   await s3Client.send(uploadCommand);

   // Save image metadata to MongoDB
   const imageUrl = `${process.env.DO_ORIGIN_ENDPOINT}/${filename}`;
   const image = new Image({
     filename: file.originalname,
     url: imageUrl,
   });
   await image.save();
   console.log('image uploaded');
   
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

const uploaImage = async (req, res, next) => {
    // Retrieve the uploaded image file
    const file = req.file;

    // Generate a unique filename
    const filename = `${uuidv4()}-${file.originalname}`;

    // Create the parameters for S3 upload
    const uploadParams = {
      Bucket: "tarabut-files",
      Key: filename,
      Body: file.buffer,
      ACL: "public-read", // Optional: Specify ACL for the uploaded file
    };

    // Upload the file to DigitalOcean Spaces using AWS SDK v3
    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3Client.send(uploadCommand);

    // Save image metadata to MongoDB
    const imageUrl = `${process.env.DO_ORIGIN_ENDPOINT}/${filename}`;
    const image = new Image({
      filename: file.originalname,
      url: imageUrl,
    });
    await image.save();
    console.log('image uploaded');
};
