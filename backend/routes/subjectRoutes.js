const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// Add subject
router.post("/", async (req, res) => {
  try {
    const { name, hours } = req.body;

    const newSubject = new Subject({
      name,
      hours
    });

    await newSubject.save();
    res.json({ msg: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
