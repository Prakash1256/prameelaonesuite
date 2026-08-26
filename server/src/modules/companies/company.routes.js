import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  listCompanies
} from "./company.repository.js";
import {
  createCompanySchema,
  listCompaniesSchema
} from "./company.validation.js";

export const companyRouter = Router();

companyRouter.get("/", async (req, res, next) => {
  try {
    const query = listCompaniesSchema.parse(req.query);
    const companies = await listCompanies(query);
    res.json(companies);
  } catch (error) {
    next(error);
  }
});

companyRouter.post("/", async (req, res, next) => {
  try {
    const input = createCompanySchema.parse(req.body);
    const company = await createCompany(input);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
});

companyRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteCompany(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: "Company not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
