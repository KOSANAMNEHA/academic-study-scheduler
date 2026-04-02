const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hours: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Subject", subjectSchema);