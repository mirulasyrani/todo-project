require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();

// Allow all origins (you can restrict this to your frontend domain if preferred)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

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
