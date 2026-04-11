const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

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
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});