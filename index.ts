import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();
const port = process.env.PORT || 8560;

// Middleware
// The cors() middleware should be first to handle preflight requests.
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});
const User = mongoose.model("User", userSchema);

// Routes
// Home route to confirm the server is running
app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
});

// GET all users route
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    // It's good practice to log the full error in production
    console.error(err); 
    res.status(500).json({ message: "Server internal error" });
  }
});

// POST to create a new user
app.post("/users", async (req, res) => {
  const { name, age } = req.body;

  // Basic validation
  if (!name || !age) {
    return res.status(400).json({ message: "Name and age are required." });
  }

  try {
    const newUser = new User({ name, age });
    await newUser.save();
    // Respond with the newly created user and a success message
    res.status(201).json({ message: `Successfully created user: ${name}`, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server internal error" });
  }
});

// Start the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));