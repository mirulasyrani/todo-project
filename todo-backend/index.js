const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth"); // <-- This is correct

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes); // Mount auth routes

// Optionally: app.use("/task", require("./routes/task"));

// Server listen
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
