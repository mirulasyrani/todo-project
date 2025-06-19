const z = require("zod");
const taskService = require("../services/taskService");

// ✅ Schema validation using zod
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  completed: z.boolean(),
  user_id: z.number(),
});

// ✅ Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user.id);
    res.json(tasks.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ✅ Create a task (with validation)
exports.createTask = async (req, res) => {
  try {
    const parsed = taskSchema.safeParse({ ...req.body, user_id: req.user.id });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const task = await taskService.createTask(parsed.data);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ✅ Update task (ownership check + validation)
exports.updateTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid 'completed' value" });
  }

  try {
    const task = await taskService.getTaskById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this task" });
    }

    const updated = await taskService.updateTask(taskId, completed);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ✅ Delete task (with ownership check)
exports.deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const task = await taskService.getTaskById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this task" });
    }

    await taskService.deleteTask(taskId);
    res.sendStatus(204); // No content
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
