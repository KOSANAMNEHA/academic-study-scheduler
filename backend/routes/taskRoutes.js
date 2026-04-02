const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Subject = require("../models/Subject");
const authMiddleware = require("../middleware/authMiddleware");

// Add task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, date, priority, startTime, endTime, color } = req.body;

    if (!subject || !date || !priority || !startTime || !endTime) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const cleanSubject = subject.trim();

    let existingSubject = await Subject.findOne({
      name: { $regex: new RegExp(`^${cleanSubject}$`, "i") }
    });

    if (!existingSubject) {
      existingSubject = new Subject({
        name: cleanSubject,
        hours: 0
      });
      await existingSubject.save();
    }

    const newTask = new Task({
      userId: req.user,
      subject: cleanSubject,
      date,
      priority,
      startTime,
      endTime,
      color
    });

    await newTask.save();

    res.status(201).json({
      msg: "Task added successfully",
      task: newTask
    });
  } catch (err) {
    console.log("TASK ADD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log("TASK FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.log("TASK UPDATE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.log("TASK DELETE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;