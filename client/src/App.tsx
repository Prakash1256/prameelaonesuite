import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CompanyForm } from "./components/CompanyForm";
import { CompanyTable } from "./components/CompanyTable";
import {
  createCompany,
  deleteCompany,
  getCompanies
} from "./lib/api";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Toast, type ToastMessage } from "./components/ui/toast";
import type {
  Company,
  CreateCompanyInput,
  SortBy,
  SortOrder
} from "./types/company";

const pageSize = 10;

function compareCompanies(
  first: Company,
  second: Company,
  sortBy: SortBy,
  sortOrder: SortOrder
) {
  const direction = sortOrder === "asc" ? 1 : -1;
  const firstValue = first[sortBy];
  const secondValue = second[sortBy];

  if (sortBy === "createdAt") {
    return (
      (new Date(firstValue).getTime() - new Date(secondValue).getTime()) *
      direction
    );
  }

  if (typeof firstValue === "number" && typeof secondValue === "number") {
    return (firstValue - secondValue) * direction;
  }

  return String(firstValue).localeCompare(String(secondValue)) * direction;
}

export function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const skipNextQueryLoad = useRef(false);

  const query = useMemo(
    () => ({ search, page, pageSize, sortBy, sortOrder }),
    [page, search, sortBy, sortOrder]
  );

  async function loadCompanies(
    nextQuery = query,
    options: { showLoading?: boolean } = {}
  ) {
    const showLoading = options.showLoading ?? true;

    if (showLoading) {
      setIsLoading(true);
      setError("");
    }

    try {
      const response = await getCompanies(nextQuery);
      setCompanies(response.data);
      setTotal(response.meta.total);
      setTotalPages(Math.max(response.meta.totalPages, 1));
    } catch (requestError) {
      if (showLoading) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load companies."
        );
      }
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
      setHasLoadedOnce(true);
    }
  }

  useEffect(() => {
    if (skipNextQueryLoad.current) {
      skipNextQueryLoad.current = false;
      return;
    }

    void loadCompanies();
  }, [query]);

  async function handleCreate(input: CreateCompanyInput) {
    try {
      const company = await createCompany(input);
      const nextQuery = { ...query, page: 1 };
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch === "" ||
        company.companyName.toLowerCase().includes(normalizedSearch);

      if (page !== 1) {
        skipNextQueryLoad.current = true;
      }

      setPage(1);

      if (matchesSearch) {
        const nextTotal = total + 1;

        setCompanies((current) =>
          [company, ...current.filter((item) => item.id !== company.id)]
            .sort((first, second) =>
              compareCompanies(first, second, sortBy, sortOrder)
            )
            .slice(0, pageSize)
        );
        setTotal(nextTotal);
        setTotalPages(Math.max(Math.ceil(nextTotal / pageSize), 1));
      }

      void loadCompanies(nextQuery, { showLoading: false });
      setToast({
        id: Date.now(),
        title: "Company created",
        description: `${company.companyName} was added to the directory.`,
        variant: "success"
      });
    } catch (requestError) {
      setToast({
        id: Date.now(),
        title: "Unable to create company",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again.",
        variant: "error"
      });
      throw requestError;
    }
  }

  async function handleDelete(id: string) {
    const company = companies.find((item) => item.id === id);
    setDeletingId(id);
    setError("");

    try {
      await deleteCompany(id);
      await loadCompanies();
      setToast({
        id: Date.now(),
        title: "Company deleted",
        description: `${company?.companyName ?? "The company"} was removed from the directory.`,
        variant: "success"
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not delete company.";
      setError(message);
      setToast({
        id: Date.now(),
        title: "Unable to delete company",
        description: message,
        variant: "error"
      });
    } finally {
      setDeletingId(null);
    }
  }

  function handleSort(nextSortBy: SortBy) {
    if (nextSortBy === sortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder("asc");
  }

  return (
    <main className="mx-auto w-[min(1180px,calc(100%_-_32px))] py-8 md:py-10">
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-sm font-semibold uppercase text-muted-foreground">
            Company directory
          </p>
          <h1 className="text-3xl font-bold tracking-normal text-foreground md:text-5xl">
            Manage companies
          </h1>
        </div>
        <p className="w-fit rounded-md border border-border bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground">
          {total} total
        </p>
      </section>

      <Card className="mb-5">
        <CardContent>
          <CompanyForm onSubmit={handleCreate} />
        </CardContent>
      </Card>

      <Card>
        <div className="border-b border-border p-4">
          <Label className="relative max-w-md">
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by company name"
            />
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
              aria-hidden="true"
            />
          </Label>
        </div>

        {error ? <Alert className="m-4">{error}</Alert> : null}
        <div className="relative">
          {isLoading && !hasLoadedOnce ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted-foreground">
              <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
              Loading companies...
            </div>
          ) : (
            <CompanyTable
              companies={companies}
              deletingId={deletingId}
              onDelete={handleDelete}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          )}

        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-4 sm:justify-end">
          <Button
            disabled={page === 1 || isLoading}
            onClick={() => setPage((current) => current - 1)}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </Card>

      {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
