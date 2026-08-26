import { ArrowDown, ArrowUp, ExternalLink, Trash2 } from "lucide-react";
import type { Company, SortBy, SortOrder } from "../types/company";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";

type CompanyTableProps = {
  companies: Company[];
  deletingId: string | null;
  onDelete: (id: string) => void;
  onSort: (sortBy: SortBy) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

const headers: Array<{ key: SortBy; label: string }> = [
  { key: "companyName", label: "Company" },
  { key: "industry", label: "Industry" },
  { key: "employeeCount", label: "Employees" },
  { key: "createdAt", label: "Created" }
];

export function CompanyTable({
  companies,
  deletingId,
  onDelete,
  onSort,
  sortBy,
  sortOrder
}: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        No companies found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[820px] md:min-w-0">
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key}>
                <Button
                  className="h-auto p-0 text-xs font-semibold uppercase text-muted-foreground"
                  onClick={() => onSort(header.key)}
                  type="button"
                  variant="ghost"
                >
                  {header.label}
                  {sortBy === header.key ? (
                    sortOrder === "asc" ? (
                      <ArrowUp size={14} aria-hidden="true" />
                    ) : (
                      <ArrowDown size={14} aria-hidden="true" />
                    )
                  ) : null}
                </Button>
              </TableHead>
            ))}
            <TableHead>Website</TableHead>
            <TableHead aria-label="Actions" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow className="grid gap-2 px-4 py-3 md:table-row md:px-0 md:py-0" key={company.id}>
              <TableCell className="flex justify-between gap-4 px-0 py-1 font-medium md:table-cell md:px-4 md:py-3">
                <span className="text-muted-foreground md:hidden">Company</span>
                {company.companyName}
              </TableCell>
              <TableCell className="flex justify-between gap-4 px-0 py-1 md:table-cell md:px-4 md:py-3">
                <span className="text-muted-foreground md:hidden">Industry</span>
                {company.industry}
              </TableCell>
              <TableCell className="flex justify-between gap-4 px-0 py-1 md:table-cell md:px-4 md:py-3">
                <span className="text-muted-foreground md:hidden">Employees</span>
                {company.employeeCount.toLocaleString()}
              </TableCell>
              <TableCell className="flex justify-between gap-4 px-0 py-1 md:table-cell md:px-4 md:py-3">
                <span className="text-muted-foreground md:hidden">Created</span>
                <span>
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium"
                  }).format(new Date(company.createdAt))}
                </span>
              </TableCell>
              <TableCell className="flex justify-between gap-4 px-0 py-1 md:table-cell md:px-4 md:py-3">
                <span className="text-muted-foreground md:hidden">Website</span>
                <span>
                  {company.website ? (
                    <a
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      href={company.website}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Visit
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </span>
              </TableCell>
              <TableCell className="flex justify-end px-0 py-1 md:table-cell md:px-4 md:py-3 md:text-right">
                <Button
                  disabled={deletingId === company.id}
                  onClick={() => onDelete(company.id)}
                  size="icon"
                  title="Delete company"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="text-destructive" size={17} aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
