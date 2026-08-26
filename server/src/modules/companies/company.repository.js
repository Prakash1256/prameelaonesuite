import { pool } from "../../db/pool.js";

const sortableColumns = {
  companyName: "company_name",
  industry: "industry",
  employeeCount: "employee_count",
  createdAt: "created_at"
};

function toCompany(row) {
  return {
    id: row.id,
    companyName: row.company_name,
    website: row.website,
    industry: row.industry,
    employeeCount: row.employee_count,
    createdAt: row.created_at.toISOString()
  };
}

export async function createCompany(input) {
  const result = await pool.query(
    `
      INSERT INTO companies (company_name, website, industry, employee_count)
      VALUES ($1, $2, $3, $4)
      RETURNING id, company_name, website, industry, employee_count, created_at
    `,
    [input.companyName, input.website ?? null, input.industry, input.employeeCount]
  );

  return toCompany(result.rows[0]);
}

export async function listCompanies(query) {
  const offset = (query.page - 1) * query.pageSize;
  const searchTerm = query.search ? `%${query.search}%` : null;
  const whereClause = searchTerm ? "WHERE company_name ILIKE $1" : "";
  const baseValues = searchTerm ? [searchTerm] : [];
  const sortColumn = sortableColumns[query.sortBy];
  const sortDirection = query.sortOrder === "asc" ? "ASC" : "DESC";

  const countResult = await pool.query(
    `SELECT COUNT(*) AS total FROM companies ${whereClause}`,
    baseValues
  );

  const listValues = [...baseValues, query.pageSize, offset];
  const limitParam = baseValues.length + 1;
  const offsetParam = baseValues.length + 2;
  const result = await pool.query(
    `
      SELECT id, company_name, website, industry, employee_count, created_at
      FROM companies
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `,
    listValues
  );

  const total = Number(countResult.rows[0].total);

  return {
    data: result.rows.map(toCompany),
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize)
    }
  };
}

export async function deleteCompany(id) {
  const result = await pool.query("DELETE FROM companies WHERE id = $1", [id]);
  return result.rowCount === 1;
}
