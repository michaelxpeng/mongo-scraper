//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var logger = require("morgan");
var cheerio = require('cheerio')
var mongojs = require("mongojs");
var axios = require("axios");

var PORT = 8080;

// Database configuration
var databaseUrl = "homework";
var collections = ["Article"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Use morgan logger for logging requests
app.use(logger("dev"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Static directory
app.use(express.static("public"));

// Set up default handlebars view
// app.engine('handlebars', exphbs({
//   defaultLayout: 'main'
// }));
// app.set('view engine', 'handlebars');

// var routes = require('./controller/controller.js');
// app.use(routes);

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/8080", { useNewUrlParser: true });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {

  axios.get("https://www.milb.com/milb/news/t-222271718").then(function (response) {
    // Load into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Select each element in the HTML body.
    $("h1.article-item__headline").each(function (i, element) {
      var link = $(element).parents(".article-item").attr("data-url");
      var title = $(element).text();
      var subhed = $(element).parents(".article-item__top").children(".article-item__subheader").text();
      var date = $(element).parents(".article-item").attr("data-datecreated");
      var author = $(element).parents(".article-item").attr("data-author");

      if (title && link && subhed && date && author) {
        db.Article.insert({
          title: title,
          subhed: subhed,
          link: "https://www.milb.com" + link,
          date: date,
          author: author,
          saved: false,
        },
          function (err, inserted) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(inserted);
            }
          });
      }
    });
    res.redirect('/');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Route for grabbing a specific Article by id, populate it with its note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: mongojs.ObjectId(req.params.id) })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.insert(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: mongojs.ObjectId(req.params.id) }, { $push: {note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/clear", function (req, res) {
  db.Article.remove({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Mark an article as saved
app.get("/save/:id", function (req, res) {

  db.Article.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      $set: { saved: true }
    }, function (error, found) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(found);
        res.json(found);
      }
    }
  );
});

// Find all articles marked as saved
app.get("/saved", function (req, res) {
  db.Article.find({ saved: true }, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Find all articles marked as unsaved
app.get("/unsaved", function (req, res) {
  db.Article.find({ saved: false }, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Route for retrieving all Notes from the db
app.get("/notes", function (req, res) {
  db.Note.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// Route for clearing all Notes from the db
app.get("/clearnotes", function (req, res) {
  db.Note.remove({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

// // Route for saving a new Note to the db and associating it with an Article
// app.post("/submit", function (req, res) {
//   // Create a new Note in the db
//   db.Note.create(req.body)
//     .then(function (dbNote) {
//       // If a Note was created successfully, find one Article (there's only one) and push the new Note's _id to the Article's `notes` array
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({}, { $push: { note: dbNote._id } }, { new: true });
//     })
//     .then(function (dbArticle) {
//       // If the Article was updated successfully, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function (err) {
//       // If an error occurs, send it back to the client
//       res.json(err);
//     });
// });