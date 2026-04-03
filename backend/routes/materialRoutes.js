const express = require("express");
const multer = require("multer");
const path = require("path");
const Material = require("../models/Material");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

// Add material
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { subject, type, title, content } = req.body;

    if (!subject || !type || !title) {
      return res.status(400).json({ msg: "Subject, type, and title are required" });
    }

    if (type === "PDF" && !req.file) {
      return res.status(400).json({ msg: "PDF file is required" });
    }

    if (type !== "PDF" && !content) {
      return res.status(400).json({ msg: "Content is required" });
    }

    const newMaterial = new Material({
      userId: req.user,
      subject,
      type,
      title,
      content: content || "",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await newMaterial.save();

    res.status(201).json({
      msg: "Material added successfully",
      material: newMaterial
    });
  } catch (err) {
    console.log("MATERIAL ADD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all materials
router.get("/", authMiddleware, async (req, res) => {
  try {
    const materials = await Material.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    console.log("MATERIAL FETCH ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete material
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Material.findOneAndDelete({ _id: req.params.id, userId: req.user });
    res.json({ msg: "Material deleted successfully" });
  } catch (err) {
    console.log("MATERIAL DELETE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;