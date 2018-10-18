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
    var savedArticle = $(this).data()
    savedArticle.saved = true;
    $(this).attr("data-articleId");
    $.ajax({
      method: "PUT",
      url: "/saved" + savedArticle.id
    }).then(function (data) {
      location.reload()
    }
    )
  })

/////CLEAR OUT ALL ARTICLES
  $("delete-all-btn").on("click", function () {
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