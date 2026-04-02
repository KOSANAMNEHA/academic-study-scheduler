const express = require("express");
const router = express.Router();
const StudySession = require("../models/StudySession");
const authMiddleware = require("../middleware/authMiddleware");

// Add study session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, minutes, mode } = req.body;

    const newSession = new StudySession({
      userId: req.user,
      subject,
      minutes,
      mode
    });

    await newSession.save();

    res.json({
      msg: "Study session saved successfully",
      session: newSession
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all study sessions of logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user }).sort({
      createdAt: -1
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete a study session
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await StudySession.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    res.json({ msg: "Study session deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;