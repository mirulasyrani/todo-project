const { z } = require("zod");

const updateTaskSchema = z.object({
  body: z.object({
    completed: z.boolean(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid task ID"),
  }),
});

module.exports = {
  updateTaskSchema,
};
