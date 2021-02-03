const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articlSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articlSchema);

module.exports = Article;
