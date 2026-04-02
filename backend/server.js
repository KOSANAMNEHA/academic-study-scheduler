const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const materialRoutes = require("./routes/materialRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded PDF files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("API Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/materials", materialRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});