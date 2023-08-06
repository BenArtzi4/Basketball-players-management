const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const MongoURI =
  "mongodb+srv://galben:1234@cluster0.gpfwkzo.mongodb.net/PlayersDB?retryWrites=true&w=majority";

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const playersSchema = {
  firstName: String,
  lastName: String,
  phoneNumber: String,
};

const Player = mongoose.model("Player", playersSchema, "Players");

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/playersFunctions.js",
  express.static(path.join(__dirname, "playersFunctions.js"))
);

app.use(express.json());

// Serve static files from the "images" directory
app.use(express.static("images"));

// Function to check if the phone number is valid
function isValidPhoneNumber(phoneNumber) {
  const pattern1 = /^\d{3}-\d{3}-\d{4}$/;
  const pattern2 = /^\d{10}$/;
  return pattern1.test(phoneNumber) || pattern2.test(phoneNumber);
}

// Endpoint to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to receive form data and add a new player to the database
app.post("/submit-form", async (req, res) => {
  const { firstName, lastName, phoneNumber } = req.body;

  if (!isValidPhoneNumber(phoneNumber)) {
    res.json({ success: false, message: "Invalid Phone Number" });
  } else {
    try {
      const player = new Player({ firstName, lastName, phoneNumber });
      await player.save();
      res.json({ success: true, message: "Player saved successfully!" });
    } catch (error) {
      console.error("Error saving player data to MongoDB:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save player data" });
    }
  }
});

// Endpoint to get all players from the database
app.get("/get-players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json({ success: true, players });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ success: false, error: "Failed to fetch players" });
  }
});

// Endpoint to delete all players from the database
app.delete("/delete-players", async (req, res) => {
  const { password } = req.body;
  if (password === "1234") {
    try {
      // Delete all players from the database
      await Player.deleteMany({});
      res.json({ success: true, message: "All players deleted successfully!" });
    } catch (error) {
      console.error("Error deleting players:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to delete players" });
    }
  } else {
    res.json({ success: false, message: "Incorrect password" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
