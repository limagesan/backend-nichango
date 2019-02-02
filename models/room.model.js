const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");

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

roomSchema.plugin(timestamps);

module.exports = mongoose.model("Room", roomSchema);
