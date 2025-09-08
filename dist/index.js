"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 7001;
const allowedOrigins = ["https://nameage-shaikhuwaizs-projects.vercel.app"];
// Middleware
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json()); // ✅ Add this line here
app.options("*", (0, cors_1.default)()); // Allow preflight requests
// MongoDB Atlas connection
mongoose_1.default
    .connect(process.env.MONGODB_URI || "")
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
// Schema + Model
const userSchema = new mongoose_1.default.Schema({
    name: String,
    age: Number,
});
const User = mongoose_1.default.model("User", userSchema);
// GET route - just a health check
app.get("/", (req, res) => {
    res.send("✅ Server is up and running!");
});
// POST route - create new user
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age } = req.body;
    try {
        const newUser = new User({ name, age });
        yield newUser.save();
        console.log("✅ Saved to DB:", newUser);
        res.json({
            message: `Received, ${name}! and you are ${age} years old.`,
            user: newUser,
        });
    }
    catch (err) {
        console.error("🔥 Express error:", err);
        res.status(500).json({ message: "Server internal error" });
    }
}));
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
