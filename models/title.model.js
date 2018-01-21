var mongoose = require("mongoose");

const titleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Title", titleSchema);
