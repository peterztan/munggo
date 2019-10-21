var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true
  },

  ratings: {
    type: Number,
    required: true
  },

  url: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },

  author: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: false
  },

  favorite: {
    type: Boolean,
    required: true,
    default: false
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

var Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;