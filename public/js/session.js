$.get("/api/saved", function(data, err) {
  if (err) {
    console.log(err);
  }
  //console.log(data);
  data.forEach(recipe => {
    var newRecipe = $("#template")
      .clone()
      .removeAttr("id")
      .removeAttr("hidden");
    newRecipe.children("recipe").attr("data-id", recipe._id);
    newRecipe.children("recipe").attr("data-headline", recipeName);
    newRecipe.find(".recipe-headline").text(recipe.headline);
    newRecipe.find(".recipe-category").text(recipe.category);
    newRecipe.find(".recipe-author").text(recipe.author);
    newRecipe
      .find(".card-body")
      .children(".btn-primary")
      .attr("href", "http://www.wired.com" + recipe.url);
    if (recipe.image) {
      newRecipe.find("img").attr("src", recipe.image);
    } else {
      newRecipe.find("img").attr("hidden", true);
    }

    $("#recipes")
      .children(".row")
      .append(newRecipe);
  });
});

// click event for "view comments" button on an recipe
$(document).on("click", ".view-comments-btn", function() {
  console.log("view comments button clicked");
  let id = $(this)
    .closest("recipe")
    .attr("data-id");
  let headline = $(this)
    .closest("recipe")
    .attr("data-headline");
  $("#commentsModalTitle").text(`Comments for "${headline}"`);
  $("#save-comment-btn").attr("data-id", id);

  loadComments(id);

  $("#commentsModal").modal("show");
});

function loadComments(id) {
  // clear all comments except for the template
  $("#comments-list")
    .children("[id!='comment-template']")
    .remove();
  // GET comments for this recipe and populate them in the modal
  $.get("/api/recipes/" + id, function(data, err) {
    if (err) {
      console.log(err);
    }
    //console.log(data);
    data.comments.forEach(comment => {
      console.log(comment.date);
      let newComment = $("#comment-template")
        .clone()
        .removeAttr("id")
        .removeAttr("hidden")
        .attr("data-id", comment._id);
      let commentDate = new Date(parseInt(comment.date));
      console.log(commentDate.toString());
      newComment
        .children("p")
        .html(`<span>${formatDate(commentDate)}</span> ${comment.body}`);
      newComment.children(".delete-comment-btn").hide();
      $("#comments-list").append(newComment);
    });
  });
}

function formatDate(date) {
  return `${date.getMonth()}.${date.getDate()}.${1900 +
    date.getYear()}, ${date.getHours() % 12 || 12}:${String(
    date.getMinutes()
  ).padStart(2, "0")}${date.getHours() < 12 ? "am" : "pm"}`;
}

$("#save-comment-btn").click(function() {
  let id = $(this).attr("data-id");
  console.log("saving new comment for recipe " + id);

  $.ajax({
    type: "POST",
    url: "/api/recipes/" + id,
    data: {
      body: $("#new-comment")
        .val()
        .trim()
    }
  }).done(data => {
    loadComments(id);
    $("#new-comment").val("");
  });
});

$(document).on("click", ".delete-comment-btn", function() {
  let recipeId = $("#save-comment-btn").attr("data-id");
  let commentId = $(this)
    .parent()
    .attr("data-id");
  console.log(`comment ${commentId} clicked`);
  $.ajax({
    type: "DELETE",
    url: "/api/comments/" + commentId
  }).done(data => {
    console.log(data);
    loadComments(recipeId);
  });
});

// show delete button on comment mouseover
$(document).on("mouseover", ".comment", function() {
  $(this)
    .children(".delete-comment-btn")
    .show();
});

// hide delete button on comment when mouse leaves
$(document).on("mouseleave", ".comment", function() {
  $(this)
    .children(".delete-comment-btn")
    .hide();
});

// click event for fav heart on each recipe
// all recipes on this page are favorites, so we will be un-favoriting it here
$(document).on("click", "i", function() {
  let id = $(this)
    .closest("recipe")
    .attr("data-id");
  let isFav = true;
  $.ajax({
    type: "PUT",
    url: "/api/favorite/" + id,
    data: { favorite: !isFav }
  }).done(data => {
    // remove recipe from Favorites page
    $(this)
      .closest(".recipe-col")
      .remove();
  });
});
