# Real State Backend (Broker App)

Node.js/Express backend for the broker app. Includes user authentication (JWT + refresh tokens), OTP via Resend, user profiles, and property listing APIs (with media management). API docs are available via Swagger UI.

## Tech stack

- **Node.js** + **TypeScript**
- **Express** (v5)
- **Prisma** + **PostgreSQL**
- **JWT auth** (access + refresh tokens)
- **Zod** validation middleware
- **Resend** for email OTP
- **Swagger UI** at `/docs` (OpenAPI spec in `docs/openapi.yaml`)

## Prerequisites

- **Node.js** (LTS recommended) + **npm**
- A **PostgreSQL** database

## Quickstart

### 1) Install dependencies

```bash
cd real_state_backend
npm install
```

### 2) Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Minimum required variables:

- **PORT**: server port (default: `4000`)
- **API_VERSION**: API prefix (example: `/api/v1`)
- **DATABASE_URL**: Postgres connection string
- **ACCESS_TOKEN_SECRET**: secret for access JWT signing
- **REFRESH_TOKEN_SECRET**: secret for refresh JWT signing
- **RESEND_API_KEY**: required to send OTP email
- **RESEND_FROM_EMAIL**: sender email (optional; defaults to `onboarding@resend.dev`)

### 3) Prisma: generate client + sync schema

```bash
npm run prisma:generate
npm run prisma:push
```

If `prisma db push` complains about a missing datasource URL, ensure `prisma/schema.prisma` has:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 4) Run the server

Dev (recommended):

```bash
npm run dev
```

Build + start:

```bash
npm run build
npm start
```

### 5) Verify it’s running

- **Health check**: `GET /health`
- **Swagger UI**: `GET /docs`

## API base paths

Routes are mounted from `src/index.ts`:

- **User**: `${API_VERSION}/user/...` (ex: `/api/v1/user/...`)
- **Property**: `${API_VERSION}/property/...` (ex: `/api/v1/property/...`)

## API Documentation (Swagger)

This project serves Swagger UI at:

- `GET /docs`

The OpenAPI spec file lives at:

- `docs/openapi.yaml`

## Authentication (for app developers)

- Send access token in every protected request:
  - Header: `Authorization: Bearer <accessToken>`
- When access token expires:
  - Call `POST ${API_VERSION}/user/auth/refresh-token` with `{ "refreshToken": "..." }`
  - Use the returned `accessToken`

### Common user auth endpoints

- `POST ${API_VERSION}/user/auth/signup`
- `POST ${API_VERSION}/user/auth/signin`
- `POST ${API_VERSION}/user/auth/send-otp`
- `POST ${API_VERSION}/user/auth/verify-otp`
- `POST ${API_VERSION}/user/auth/forgot-password`
- `POST ${API_VERSION}/user/auth/reset-password`
- `POST ${API_VERSION}/user/auth/signout`
- `POST ${API_VERSION}/user/auth/signout-all`

### Profile endpoints

- `GET ${API_VERSION}/user/profile`
- `PUT ${API_VERSION}/user/profile`

### Property endpoints

- `POST ${API_VERSION}/property`
- `GET ${API_VERSION}/property`
- `GET ${API_VERSION}/property/my-properties`
- `GET ${API_VERSION}/property/:id`
- `PUT ${API_VERSION}/property/:id`
- `DELETE ${API_VERSION}/property/:id`
- `POST ${API_VERSION}/property/:id/media`
- `DELETE ${API_VERSION}/property/media/:id`
- `PUT ${API_VERSION}/property/change-status/:id`

## Scripts

From `package.json`:

- `npm run dev`: run server in watch mode
- `npm run build`: build TypeScript via `tsup`
- `npm start`: run compiled server from `dist/`
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:push`: push Prisma schema to DB (no migrations)

## Project structure

- `src/index.ts`: app entrypoint, route mounting, `/docs`
- `src/routes/`: Express route modules
- `src/controllers/`: request handlers (business logic)
- `src/middleware/`: auth + zod validate middleware
- `src/validators/`: Zod schemas
- `src/services/`: OTP + external services (Resend)
- `src/utils/`: JWT/password helpers
- `prisma/schema.prisma`: database schema

## Notes
- If you change `API_VERSION`, all routes move accordingly (Swagger UI stays at `/docs`).