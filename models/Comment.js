var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },

  date: {
    type: String,
    required: true,
    default: Date.now
  }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
