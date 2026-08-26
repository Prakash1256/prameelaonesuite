export type Company = {
  id: string;
  companyName: string;
  website: string | null;
  industry: string;
  employeeCount: number;
  createdAt: string;
};

export type CreateCompanyInput = {
  companyName: string;
  website: string;
  industry: string;
  employeeCount: number;
};

export type CompanyListResponse = {
  data: Company[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type SortBy = "companyName" | "industry" | "employeeCount" | "createdAt";
export type SortOrder = "asc" | "desc";
