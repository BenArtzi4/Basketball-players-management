const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

// Middleware to parse incoming request data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/functions.js", express.static(path.join(__dirname, "functions.js")));

// Store the submitted form data in an array
const users = [];

// Endpoint to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to receive form data
app.post("/submit-form", (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  if (users.length === 0) {
    // If there are no users (first form submission), replace the example row
    users.push({ firstName, lastName, phoneNumber });
    res.json({ success: true, replaceExampleRow: true });
  } else {
    users.push({ firstName, lastName, phoneNumber });
    res.json({ success: true, replaceExampleRow: false });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
