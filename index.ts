import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 7003;

// Allow all origins
app.use(cors({
  origin: "*", // <-- this allows requests from anywhere
  methods: ["GET", "POST", "OPTIONS"],
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({ name: String, age: Number });
const User = mongoose.model("User", userSchema);

app.get("/users", (req, res) => res.send("✅ Server is up and running!"));

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
