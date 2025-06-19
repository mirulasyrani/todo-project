const express = require("express");
const router = express.Router();
const pool = require("../db");

const { requireAuth } = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");
const validate = require("../middleware/validate"); // ✅ your Zod validation middleware
const { updateTaskSchema } = require("../schemas/taskSchemas"); // ✅ schema file you'll create

// ✅ Get all tasks
router.get("/", async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = user_id
      ? await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC", [user_id])
      : await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get one task
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new task (optional: add auth & validation)
router.post("/", async (req, res) => {
  const { title, completed = false, user_id } = req.body;
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

// ✅ Update task (secured, validated, ownership checked)
router.put("/:id", requireAuth, validate(updateTaskSchema), taskController.updateTask);

// ✅ Delete task (secured, ownership checked)
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) return res.status(404).json({ error: "Task not found" });
    if (task.rows[0].user_id !== userId)
      return res.status(403).json({ error: "Not authorized to delete this task." });

    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
