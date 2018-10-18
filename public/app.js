$(document).ready(function () {
  /////SCRAPE
  $("#scrape-btn").on("click", function (event) {
    event.preventDefault()
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .then(function (data) {
        console.log(data);
        location.reload()

      })
  })

  ////GET AN ARTICLE
  $("#article-btn").on("click", function () {

    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisID
    })
      .then(function (data) {
        location.reload()
      })
  })

  /////SAVE AN ARTICLE
  $("#save-btn").on("click", function (event) {
    var savedArticle = $(this).attr("data-articleid");
    // savedArticle.saved = true;

    $.ajax({
      method: "GET",
      url: "/saved/" + savedArticle
    }).then(function (data) {
      location.reload()
    }
    )
  })

  /////CLEAR OUT ALL ARTICLES
  $("#delete-all-btn").on("click", function () {
    $("#articles").empty();
    $.ajax({
      method: "GET",
      url: "/clear"
    }).then(function () {
      console.log("Articles Cleared")
      window.location.href = "/";
    });
  });
});

// Run a POST request to change the note, using what's entered in the inputs
$("#comment").on("click", function() {

$.ajax({
  method: "POST",
  url: "/saved/" + thisId,
  data: {
    // Value taken from title input
    title: $("#comment-title").val(),
    // Value taken from note textarea
    body: $("#comment-body").val()
  }
})
  // With that done
  .then(function (data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#notes").empty();
  });

// Also, remove the values entered in the input and textarea for note entry
$("#comment-title").val("");
$("#comment-body").val("");
});
  
