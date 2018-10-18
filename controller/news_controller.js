
//requiring dependencies
var express = require("express");
var router = express.Router();
var path = require('path');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// router.get('/', function (req, res) {
//     //something goes here
//     res.redirect('./articles') //maybe?? chek this

// });

router.get("/", (req, res) => {
    db.Article.find({})
        .then(function (dbArticle) {
            /////////////////////////////TEST THIS
           var hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);        
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Clearing articles not saved to save again
router.get('/clear', function(req, res) {
    db.Article.remove({ saved: false}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('removed');
        }

    });
    res.redirect('/articles');
});


///////////////////SCRAPING///////////////////////////////////
router.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/us").then(function (response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);


        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("div.story-body").each(function (i, element) {

            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element)
                .children("h2.headline")
                .text();
            result.link = $(element)
                .find("a")
                .attr("href");
            result.summary = $(element)
                .find("p.summary")
                .text();

            // Create a new Article using the `result` object built from scraping
            if (result.title && result.link && result.summary){
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
            }
        });
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
        res.redirect("/")
    });

});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    db.Article.find().sort({_id: -1})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })

});


// Route for grabbing a specific Article by id, populate it with it's note
router.get("/saved/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })

        .populate("comment")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

////////////////////////////////check
router.get("/saved", function(req, res) {
    db.Article.find({saved: true})
      .then(function(dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("saved", hbsObject);        
    })
      .catch(function(err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      })
  
  });

  router.get('/saved/:id', function(req,res) {
    db.Article.update({_id: req.params.id},{saved: true})
      .then(function(result) {
           res.redirect('/')
        })
      .catch(function(err) {
          res.json(err)
      })
  });
  


// Route for saving/updating an Article's associated Note
router.post("/saved/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {comment: dbComment._id }}, { name: dbComment._id }, { saved: true });
        })
        .then(function (dbArticle) {
            res.render("saved", {articles: dbArticle})
          })
        .catch(function (err) {
           res.json(err);
        })
});

router.delete("/comment/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ comment: req.params.id }, { $pull: { comment: dbComment._id }});
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


module.exports = router
