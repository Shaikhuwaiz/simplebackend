import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 8001;

// Allow all origins (no credentials)
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({ name: String, age: Number });
const User = mongoose.model("User", userSchema);

// Root route
app.get("/", (req, res) => res.send("✅ Server is up and running!"));

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server internal error" });
  }
});

// Create user
app.post("/users", async (req, res) => {
  const { name, age } = req.body;
  try {
    const newUser = new User({ name, age });
    await newUser.save();
    res.json({ message: `Received ${name}, age ${age}!`, user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server internal error" });
  }
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
