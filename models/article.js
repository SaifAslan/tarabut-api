const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  title: {
    type: [{
      langCode: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  // author: {
  //   type: String,
  //   required: true
  // },
  content: {
    type: [{
      langCode: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
