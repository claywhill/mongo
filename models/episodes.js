var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EpisodeSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
})

var Episode = mongoose.model("Episode", EpisodeSchema);

module.exports = Episode;