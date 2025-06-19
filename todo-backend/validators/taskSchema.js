const { z } = require("zod");

const updateTaskSchema = z.object({
  body: z.object({
    completed: z.boolean({
      required_error: "Completed field is required",
      invalid_type_error: "Completed must be a boolean",
    }),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Task ID must be a numeric string"),
  }),
});

module.exports = {
  updateTaskSchema,
};
