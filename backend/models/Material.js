const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["PDF", "Link", "Notes", "Video", "Document"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ""
    },
    fileUrl: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);