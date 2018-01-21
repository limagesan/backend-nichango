var mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  texts: {
    type: Array,
    required: false
  }
});

module.exports = mongoose.model("Room", roomSchema);
