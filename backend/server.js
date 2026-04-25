const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../ai_module/known_faces"); // save in your Python folder
  },
  filename: function (req, file, cb) {
    const name = req.body.name;
    const ext = path.extname(file.originalname);
    cb(null, name + "_" + Date.now() + ext);
  },
});

const upload = multer({ storage: storage });


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rain",
  database: "surveillance",
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Get all events
app.get("/events", (req, res) => {
  const query = "SELECT * FROM events ORDER BY timestamp DESC";

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching data" });
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/add-face", upload.single("image"), (req, res) => {
  try {
    const name = req.body.name;

    if (!name || !req.file) {
      return res.status(400).json({ error: "Name and image required" });
    }

    res.json({ message: "Face added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});