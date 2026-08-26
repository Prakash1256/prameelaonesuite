import { z } from "zod";

export const createCompanySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(160),
  website: z
    .string()
    .trim()
    .url("Website must be a valid URL")
    .max(255)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value)),
  industry: z.string().trim().min(1, "Industry is required").max(120),
  employeeCount: z.coerce
    .number()
    .int("Employee count must be a whole number")
    .min(0, "Employee count cannot be negative")
});

export const listCompaniesSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z
    .enum(["companyName", "industry", "employeeCount", "createdAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
});
