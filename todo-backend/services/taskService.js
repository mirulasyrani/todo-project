// services/taskService.js
const pool = require("../db");

exports.getTasks = async (userId) => {
  return pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC", [userId]);
};

exports.getTaskById = async (id) => {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  return result.rows[0];
};

exports.createTask = async ({ title, completed, user_id }) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, completed, user_id]
  );
  return result.rows[0];
};

exports.updateTask = async (id, completed) => {
  const result = await pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  return result.rows[0];
};

exports.deleteTask = async (id) => {
  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
};
