import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const User = mongoose.model("User", userSchema);

// ✅ GET route (for browser check)
app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
});

// ✅ POST route (for Postman or frontend)
app.post("/submit", async (req, res) => {
  const { name, age } = req.body;

  try {
    const newUser = new User({ name, age });
    await newUser.save();
    console.log("✅ Saved to DB:", newUser);
    res.send(
      `Received, ${name}! and you are ${age} years old. Saved to database.`
    );
  } catch (err) {
    console.error("❌ Error saving to DB:", err);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
