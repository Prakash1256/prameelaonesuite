import { DatabaseError } from "pg";
import { ZodError } from "zod";

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    });
    return;
  }

  if (error instanceof DatabaseError && error.code === "23505") {
    res.status(409).json({ message: "A company with this name already exists" });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
