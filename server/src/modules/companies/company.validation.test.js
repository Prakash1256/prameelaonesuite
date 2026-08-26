import { describe, expect, it } from "vitest";
import { createCompanySchema } from "./company.validation.js";

describe("createCompanySchema", () => {
  it("accepts valid company data", () => {
    const result = createCompanySchema.parse({
      companyName: "Acme Inc",
      website: "https://acme.example",
      industry: "Software",
      employeeCount: 42
    });

    expect(result.companyName).toBe("Acme Inc");
    expect(result.employeeCount).toBe(42);
  });

  it("rejects negative employee counts", () => {
    expect(() =>
      createCompanySchema.parse({
        companyName: "Acme Inc",
        industry: "Software",
        employeeCount: -1
      })
    ).toThrow();
  });
});
