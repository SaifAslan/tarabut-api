const express = require("express");
require("dotenv").config();
// const authentication = require("./routes/authentication");
const api = require("./routes/api");

const { default: mongoose } = require("mongoose");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


const app = express();

app.use(express.json());


// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'tarabut-files',
//     acl: 'public-read',
//     key: function (request, file, cb) {
//       console.log(file);
//       cb(null, file.originalname);
//     }
//   })
// }).array('upload', 1);



app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


// app.use("/authentication", authentication);
app.use("/api", api);

app.use((error, req, res, next) => {
  console.log(error.statusCode);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const mongodb_URI = `mongodb+srv://tarabut-org:${process.env.MONGODB_PASSWORD}@main-cluster.if3onz1.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
//connecting  to the database
mongoose
  .connect(mongodb_URI)
  .then((result) => {
    //when the connection is successful listen to the port
    app.listen(process.env.PORT || 8080, function () {
      console.log(
        "Express server listening on port %d in %s mode",
        this.address().port,
        app.settings.env
      );
    });
  })
  .catch((err) => console.log(err));
