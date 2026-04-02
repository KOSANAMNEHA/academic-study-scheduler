const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    },
    mode: {
      type: String,
      enum: ["focus", "break"],
      default: "focus"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudySession", studySessionSchema);