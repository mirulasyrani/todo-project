const pool = require("../db");
const z = require("zod");

// ✅ Schema to validate task creation input
const createTaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean(),
  user_id: z.number(),
});

// ✅ Schema to validate task update
const updateTaskSchema = z.object({
  id: z.number(),
  completed: z.boolean(),
  user_id: z.number(),
});

// ✅ Get all tasks for a user
exports.getTasks = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC",
    [userId]
  );
  return result.rows;
};

// ✅ Get a single task by ID
exports.getTaskById = async (id) => {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  return result.rows[0];
};

// ✅ Create a new task (validated)
exports.createTask = async (data) => {
  const validated = createTaskSchema.parse(data);
  const result = await pool.query(
    "INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
    [validated.title, validated.completed, validated.user_id]
  );
  return result.rows[0];
};

// ✅ Update a task — only if owned by the user
exports.updateTask = async ({ id, completed, user_id }) => {
  const validated = updateTaskSchema.parse({ id, completed, user_id });

  // Check ownership
  const taskRes = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  const task = taskRes.rows[0];
  if (!task) throw new Error("Task not found");
  if (task.user_id !== user_id) throw new Error("Unauthorized");

  const result = await pool.query(
    "UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  return result.rows[0];
};

// ✅ Delete a task — only if owned by the user
exports.deleteTask = async (id, user_id) => {
  const taskRes = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  const task = taskRes.rows[0];
  if (!task) throw new Error("Task not found");
  if (task.user_id !== user_id) throw new Error("Unauthorized");

  await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  return { success: true };
};
