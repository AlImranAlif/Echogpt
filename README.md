# EchoGPT Backend

Production-oriented NestJS + PostgreSQL + Prisma backend for the EchoGPT Chrome Extension.

## Stack
- NestJS 11 / TypeScript
- PostgreSQL 17
- Prisma ORM
- JWT access tokens + rotating refresh sessions
- Swagger/OpenAPI
- Helmet, CORS, validation, RBAC
- AES-256-GCM encrypted provider API keys
- OpenAI, Anthropic Claude and Google Gemini adapters
- Serper-backed web search (optional)

## Quick start

### 1. Requirements
Node.js 20+, Docker Desktop, and npm.

### 2. Configure
```bash
copy .env.example .env
```
Set strong `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and exactly 32 characters for `ENCRYPTION_KEY`.

### 3. Start PostgreSQL
```bash
docker compose up -d postgres
```

### 4. Install and migrate
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 5. Run
```bash
npm run start:dev
```
API: `http://localhost:3000/api/v1`
Swagger: `http://localhost:3000/docs`

Seed admin: `admin@echogpt.local` / `ChangeMe123!` — change this immediately in any non-local environment.

## Main endpoints
- `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password`
- `GET /subscriptions`, `GET /subscriptions/usage`, `POST /subscriptions`
- `GET/POST/PATCH/DELETE /providers`, `POST /providers/:id/health`
- `POST /chat`, `GET /chat/conversations`, `GET /chat/conversations/:id`
- `POST /search`, `GET /search/history`, `/search/recent`, `/search/suggestions`
- `GET /admin/dashboard`, `/users`, `/subscriptions`, `/providers`, `/usage`, `/health`

## Security notes
- Provider keys are never returned by API responses and are encrypted at rest with AES-256-GCM.
- Refresh tokens are stored only as bcrypt hashes and are rotated on refresh.
- Access tokens are short-lived.
- Role checks are enforced for admin endpoints.
- Validation strips/rejects unknown input fields.
- Use HTTPS/TLS, a secrets manager, rate limiting, email verification, audit logging, and a managed PostgreSQL service in production.

## Architecture
`Controller -> Service -> Prisma -> PostgreSQL`, with auth/RBAC guards and provider adapters at the application boundary. The current implementation keeps the modules isolated so provider calls, billing, caching, and streaming can be extracted into dedicated services as traffic grows.

## Git history recommendation
Use focused commits such as:
1. `chore: bootstrap NestJS and Prisma`
2. `feat: add JWT auth and refresh sessions`
3. `feat: add users and subscriptions`
4. `feat: add encrypted AI provider management`
5. `feat: add multi-provider chat API`
6. `feat: add web search APIs`
7. `feat: add admin analytics and health endpoints`
8. `docs: add Swagger and setup guide`
