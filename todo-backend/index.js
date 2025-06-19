require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ CORS: allow all origins dynamically (use carefully in production)
app.use(
  cors({
    origin: true, // Reflects the request origin automatically
    credentials: true,
  })
);

// ✅ Route handlers
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// ✅ Server start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
