import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 7002;

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://your-frontend-url.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true, // only if you need cookies/auth
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
