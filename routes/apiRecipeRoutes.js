var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/api/recipes", function(req, res) {
    axios
      .get(
        "https://www.allrecipes.com/recipes/696/world-cuisine/asian/filipino/"
      )
      .then(function(response) {
        var $ = cheerio.load(response.data);

        console.log(response.data);

        $(".fixed-recipe-card").each(function(i, element) {
          var result = {};

          result.recipeName = $(this)
            .find(".fixed-recipe-card__info")
            .find(".fixed-recipe-card__info")
            .find(".fixed-recipe-card__h3")
            .find("a")
            .find("span")
            .text();

          console.log(result.recipeName);

          result.ratings = $(this)
            .find(".fixed-recipe-card__info")
            .find(".fixed-recipe-card__info")
            .find(".ng-isolate-scope")
            .find(".fixed-recipe-card__ratings")
            .find(".stars")
            .attr("data-ratingstars")
            .val();

          console.log(result.ratings);

          result.url = $(this)
            .find(".fixed-recipe-card__info")
            .find("a")
            .attr("href");

          result.image = $(this)
            .find("a")
            .attr("data-imageurl")
            .valueOf();

          result.descriptions = $(this)
            .find(".fixed-recipe-card__info")
            .find("a")
            .find(".fixed-recipe-card__description")
            .text();

          var storedAuthors = [];

          $(this)
            .find("fixed-recipe-card__profile")
            .find("a")
            .find("ul")
            .find("li")
            .find("h4")
            .each(function(index, obj) {
              storedAuthors.push($(this).text());
            });

          result.author = storedAuthors.join(" & ");

          db.Recipe.create(result)
            .then(function(dbRecipe) {
              console.log(dbRecipe);
            })
            .catch(function(err) {
              console.log(err);
            });
        });

        db.Recipe.find({})
          .then(function(dbRecipe) {
            res.json(dbRecipe);
          })
          .catch(function(err) {
            res.json(err);
          });
      });
  });

  app.get("/api/saved", function(req, res) {
    db.Recipe.find({ favorite: true })
      .then(function(dbRecipe) {
        res.json(dbRecipe);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.put("/api/favorite/:id", function(req, res) {
    db.Recipe.updateOne(
      { _id: req.params.id },
      { favorite: Boolean(req.body.favorite === "true") }
    )
      .then(function(dbRecipe) {
        console.log("success");
        console.log(dbRecipe);
        res.json(dbRecipe);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/api/recipes/:id", function(req, res) {
    db.Recipe.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function(dbRecipe) {
        res.json(dbRecipe);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.post("/api/recipes/:id", function(req, res) {
    console.log("adding a commen...");
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Recipe.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { comments: dbComment._id } },
          { new: true }
        );
      })
      .then(function(dbRecipe) {
        res.json(dbRecipe);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.delete("/api/comments/:id", function(req, res) {
    console.log("Received a DELETE request for comment " + req.params.id);
    db.Comment.deleteOne({ _id: req.params.id })
      .then(function(dbComment) {
        res.json(dbComment);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
