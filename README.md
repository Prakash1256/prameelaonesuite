# Company Manager

A small full-stack application for managing companies. The backend uses Express and PostgreSQL, and the frontend uses React, Vite, and TypeScript.

## Features

- Create a company
- List companies
- Search companies by name
- Delete companies
- Pagination and sorting
- Client and server validation
- Loading states and error handling
- Responsive table layout
- Tailwind CSS styling with shadcn-style UI components
- Docker Compose setup for PostgreSQL
- Basic backend unit tests

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn-style components
- Backend: Node.js, Express, JavaScript
- Database: PostgreSQL
- Validation: Zod
- Tests: Vitest, Supertest

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL for local development:

```bash
docker compose up -d postgres
```

Or run the database, API, and frontend fully through Docker:

```bash
docker compose up --build
```

3. Create environment files:

You only need these files when running with `npm run dev`.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Start both apps locally:

```bash
npm run dev
```

The API runs on `http://localhost:4000` and the frontend runs on `http://localhost:5173`.

## Verification Commands

```bash
npm run typecheck
npm test
npm run build
```

## Environment Variables

Backend (`server/.env`):

```env
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/company_manager
CORS_ORIGIN=http://localhost:5173
```

Frontend (`client/.env`):

```env
VITE_API_URL=http://localhost:4000/api
```

## API Endpoints

- `POST /api/companies` creates a company
- `GET /api/companies` lists companies
- `GET /api/companies?search=acme` searches companies by name
- `GET /api/companies?page=1&pageSize=10&sortBy=companyName&sortOrder=asc` paginates and sorts companies
- `DELETE /api/companies/:id` deletes a company

## Assumptions Made

- Although the user asked for MERN, the assignment requires PostgreSQL, so this project uses the MERN-style Express/React/Node stack with PostgreSQL instead of MongoDB.
- Company names are required and should be unique.
- Website is optional but must be a valid URL when provided.
- Employee count must be a non-negative integer.

## Known Limitations

- Authentication is not included because it was outside the assignment scope.
- Database migrations are represented by a single SQL schema file rather than a full migration tool.
- Deployment configuration is documented but not connected to a live hosting account.

## Future Improvements

- Add authentication and authorization.
- Add edit company support.
- Replace the SQL schema file with a migration tool such as Drizzle Kit, Prisma Migrate, or node-pg-migrate.
- Add end-to-end tests with Playwright.
- Add production deployment manifests for Render, Railway, or Fly.io.
