import type {
  Company,
  CompanyListResponse,
  CreateCompanyInput,
  SortBy,
  SortOrder
} from "../types/company";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type ListCompanyParams = {
  search: string;
  page: number;
  pageSize: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export function getCompanies(params: ListCompanyParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder
  });

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  return request<CompanyListResponse>(`/companies?${searchParams.toString()}`);
}

export function createCompany(input: CreateCompanyInput) {
  return request<Company>("/companies", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function deleteCompany(id: string) {
  return request<void>(`/companies/${id}`, {
    method: "DELETE"
  });
}
