const express = require("express");
const pool = require("../db");

const router = express.Router();

// Get all tasks (optionally filtered by user_id)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new task
router.post("/", async (req, res) => {
  const { title, completed, user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, completed, user_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task completion
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
