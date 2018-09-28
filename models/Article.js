var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // `notes` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  notes: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  subhed: {
    type: String,
    required: true
  }, 
  date: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true
  }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;