import { z } from "zod";

export const formatZodErrors = (errors: z.ZodIssue[]) => {
  return errors
    .map((err) => {
      const field = err.path.join(".");
      const message = err.message;
      return `• ${field.charAt(0).toUpperCase() + field.slice(1)}: ${message}`;
    })
    .join("\n");
};
