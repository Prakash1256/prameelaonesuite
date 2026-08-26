CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(160) NOT NULL UNIQUE,
  website VARCHAR(255),
  industry VARCHAR(120) NOT NULL,
  employee_count INTEGER NOT NULL CHECK (employee_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_company_name
  ON companies USING gin (company_name gin_trgm_ops);
