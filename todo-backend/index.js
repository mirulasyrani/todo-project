require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ required to read cookies

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// ✅ Middleware to parse cookies
app.use(cookieParser());

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ CORS setup with dynamic origin and credentials
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",         // local dev
        "https://yourfrontenddomain.com" // optional: production frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Route handlers
app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// ✅ Server startup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
