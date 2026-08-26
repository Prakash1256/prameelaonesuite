import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import type { CreateCompanyInput } from "../types/company";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type CompanyFormProps = {
  onSubmit: (input: CreateCompanyInput) => Promise<void>;
};

type CompanyFormState = {
  companyName: string;
  website: string;
  industry: string;
  employeeCount: string;
};

const initialForm: CompanyFormState = {
  companyName: "",
  website: "",
  industry: "",
  employeeCount: ""
};

export function CompanyForm({ onSubmit }: CompanyFormProps) {
  const [form, setForm] = useState<CompanyFormState>(initialForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setFormError("");

    if (!form.companyName.trim() || !form.industry.trim()) {
      setFormError("Company name and industry are required.");
      return;
    }

    const employeeCount = Number(form.employeeCount);

    if (
      form.employeeCount.trim() === "" ||
      employeeCount < 0 ||
      Number.isNaN(employeeCount) ||
      !Number.isInteger(employeeCount)
    ) {
      setFormError("Employee count must be a non-negative whole number.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...form,
        companyName: form.companyName.trim(),
        industry: form.industry.trim(),
        website: form.website.trim(),
        employeeCount
      });
      setForm(initialForm);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not create company.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Label>
          <span>Company name</span>
          <Input
            value={form.companyName}
            onChange={(event) =>
              setForm((current) => ({ ...current, companyName: event.target.value }))
            }
            placeholder="Acme Inc"
          />
        </Label>

        <Label>
          <span>Website</span>
          <Input
            value={form.website}
            onChange={(event) =>
              setForm((current) => ({ ...current, website: event.target.value }))
            }
            placeholder="https://example.com"
            type="url"
          />
        </Label>

        <Label>
          <span>Industry</span>
          <Input
            value={form.industry}
            onChange={(event) =>
              setForm((current) => ({ ...current, industry: event.target.value }))
            }
            placeholder="Software"
          />
        </Label>

        <Label>
          <span>Employees</span>
          <Input
            value={form.employeeCount}
            inputMode="numeric"
            onChange={(event) => {
              const employeeCount = event.target.value;

              if (/^\d*$/.test(employeeCount)) {
                setForm((current) => ({ ...current, employeeCount }));
              }
            }}
            pattern="[0-9]*"
            placeholder="e.g. 120"
            type="text"
          />
        </Label>
      </div>

      {formError ? <Alert>{formError}</Alert> : null}

      <Button
        aria-busy={isSubmitting}
        className="w-full min-w-40 sm:w-fit"
        type="submit"
      >
        <Plus size={18} aria-hidden="true" />
        Create company
      </Button>
    </form>
  );
}
