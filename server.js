var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/orderOfMan", {useNewUrlParser: true });

app.get("/scrape", function(req, res) {

  axios.get("https://www.orderofman.com/").then(function(response) {

  var $ = cheerio.load(response.data);

  $("h3.entry-title").each(function(i, element) {
    
  var result = {};

  result.title = $(this)
    .children("a")
    .text();
  result.link = $(this)
    .children("a")
    .attr("href");

  db.Episode.create(result)
    .then(function(dbEpisode) {
      console.log(dbEpisode);
    })
    .catch(function(err) {
      console.log(err);
    })
  })

res.send("Scrape Complete");
  })
})

app.get("/episodes", function(req, res) {
  db.Episode.find({})
    .then(function(dbEpisode) {
      res.json(dbEpisode);
    })
    .catch(function(err) {
      res.json(err);
    })
})

app.get("/episodes/:id", function(req, res) {
  db.Episode.find({ _id: req.params.id })
    .populate("note")
    .then(function(dbEpisode) {
      res.json(dbEpisode);
    })
    .catch(function(err) {
      res.json(err);
    })
})

app.post("/episodes/:id", function(req, res) {
  db.Episode.create(req.body)
  .then(function(dbNote) {
    return db.Episode.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
  .then(function(dbEpisode) {
    res.json(dbEpisode);
  })
  .catch(function(err) {
    res.json(err);
  })
})

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
})