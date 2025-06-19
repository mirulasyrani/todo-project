require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// ✅ CORS setup to allow all dynamic origins (safe for dev)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl or mobile apps)
      if (!origin) return callback(null, true);
      return callback(null, true); // Allow all origins (dev mode)
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

// Health check route (optional)
app.get("/", (req, res) => {
  res.send("API is running");
});

// Use Railway-assigned port or default to 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
