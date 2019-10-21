console.log("app.js loaded.");

$.get("/api/recipes", function(data, err) {
  if (err) {
    console.log(err);
  }
  console.log(data);
  data.forEach(Recipe => {
    let newRecipe = $("#template")
      .clone()
      .removeAttr("id")
      .removeAttr("hidden");
    newRecipe.children("article").attr("data-id", Recipe._id);
    newRecipe
      .children("article")
      .attr("data-fav", recipe.favorite)
      .find("i")
      .removeClass(Recipe.favorite ? "far" : "fas")
      .addClass(Recipe.favorite ? "fas" : "far");
    newRecipe.find(".recipeName").text(Recipe.headline);
    newRecipe.find(".recipe-ratings").text();
    newRecipe.find(".recipe-author").text(Recipe.author);
    newRecipe
      .find(".card-body")
      .children(".btn-primary")
      .attr("href", Recipe.url);
    if (Recipe.image) {
      newRecipe.find("img").attr("src", Recipe.image);
    } else {
      newRecipe.find("img").attr("hidden", true);
    }

    $("#Recipes")
      .children(".row")
      .append(newRecipe);
  });
});

$(document).on("click", "i", function() {
  var id = $(this)
    .closest("recipe")
    .attr("data-id");
  var isFav = Boolean(
    $(this)
      .closest("recipe")
      .attr("data-fav") === "true"
  );
  console.log(
    $(this)
      .closest("recipe")
      .attr("data-fav")
  );
  console.log("id" + id + " faved: " + isFav);
  $.ajax({
    type: "PUT",
    url: "/api/favorite/" + id,
    data: { favorite: !isFav }
  }).done(data => {
    $(this)
      .toggleClass("far")
      .toggleClass("fas");
  });
});
