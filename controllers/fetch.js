var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Initialize Express
//var app = express();
var express = require("express");
var app = express();

//fetch all had app.js file contents here
// Grab the headlines as a json
module.exports = function (app) {

  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.coindesk.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("div.article h3").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .text();
        result.link = $(this)
          .children("a.fade")
          .attr("href");
          result.summary = "something";
          result.image = "something";

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      // res.redirect("/");
    });
  });

}
