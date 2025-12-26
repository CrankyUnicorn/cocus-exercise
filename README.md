# Cocus Technical Exercise — Full-Stack TypeScript (React + Node)

## Objective
Build a mini-app using Docker containers. Use Docker Compose to build and run the applications.  
The project consists of two applications: a backend in **Node.js + TypeScript** and a frontend in **React + TypeScript**, including API, persistence, UI, tests, and a bit of observability.

Both containers should use volumes if necessary. For example, the backend will run SQLite and therefore requires persistence.

---

## Product Theme
**Feature Flags / Experiments Manager (mini)**

An app where a product team creates “flags” (e.g. `newCheckoutFlow`) and controls their activation by environment and rollout percentage.

---

## Backend Requirements (Node + TypeScript)

### Build
Create an HTTP service using **Express**.

### Entities

**FeatureFlag**
- `id` (uuid)
- `key` (unique string, e.g. `new_checkout`)
- `description` (string)
- `enabled` (boolean)
- `rolloutPercentage` (0–100)
- `createdAt` and `updatedAt`

### Minimum Endpoints
1. `POST /flags` — create a flag  
2. `GET /flags` — list flags (with simple pagination: `?limit=&cursor=` or `?page=`)  
3. `GET /flags/:id` — get details  
4. `PATCH /flags/:id` — update the fields `enabled`, `rolloutPercentage`, and `description`  
5. `DELETE /flags/:id` — remove a flag  
6. `GET /evaluate?key=*****&userId=*****` — returns whether the flag is “active” for a user  
   > Logic:
   > - If `enabled = false` ⇒ `active = false`
   > - If `enabled = true`, use a deterministic hash of `userId` to decide whether it falls within the `rolloutPercentage`

### Persistence
- SQLite via **Prisma**
- Input validation with **Joi**

### Quality and Operations
- Structured logging (**pino** or **winston**) with request ID
- Consistent error handling (400, 404, 409)
- At least 3 unit tests covering:
  > - creation + uniqueness of `key`
  > - updating rollout with validation (0–100)
  > - deterministic evaluation (same `userId` ⇒ same result)

---

## Frontend Requirements (React + TypeScript)

### UI
Simple UI using native React elements.

### Minimum Pages / Flows
1. **Flags list**
   > - search by `key` / `description`  
   > - toggle `enabled` (optimistic UI is a plus)  
2. **Detail / edit**
   > - edit description  
   > - slider/input for `rolloutPercentage`  
3. **Create new flag**  
4. **Evaluate playground**
   > - input `key` + `userId`  
   > - shows `active = true / false` and explains the result

### Frontend Expectations
> - State management with **React Query**  
> - Good UX: loading/error states, validations, success feedback

---

## Supplementary Tasks
- Create `GET /health` to expose simple metrics or basic tracing.
- **Event-driven**: when a flag changes, publish an event.  
  > - This event does not need to be stored in the database.  
  > - The event should trigger an API call via **axios** to Slack.  
  > - Credentials should be found in the `.env` file under the name `SLACK_BOT_TOKEN`.

---

## Structure

- /backend — Node/TypeScript API using Express + Prisma (SQLite in dev)
- /frontend — React + TypeScript client (uses React Query)
- /prisma — Prisma schema for backend

## Prerequisites

- Node 20 / npm (tested with Node 20.19.5)
- Docker (optional)
- git (optional)

## Environment

Create a .env file in backend (do not commit):

    DATABASE_URL="file:./prisma/dev.db"

For container builds, use an absolute path or --env-file / docker-compose.

## Backend — Local Dev

    cd backend
    npm install
    mkdir -p prisma && touch prisma/dev.db && chmod 0666 prisma/dev.db
    npx prisma generate
    npx prisma db push
    npm run dev       # requires ts-node-dev
    npm test

Notes:
- Ensure DATABASE_URL points to a valid SQLite path.
- For container builds, set appropriate binaryTargets in prisma/schema.prisma and run npx prisma generate.

## Frontend — Local Dev

    cd frontend
    npm install
    npm start

- Defaults to backend at http://localhost:3000. Override with REACT_APP_BACKEND_URL.

## Docker

- dockerfile.dev — development (ts-node-dev)
- dockerfile — production (multi-stage)

Notes:
- Alpine images need libc6-compat and openssl.
- Update prisma/schema.prisma with container binaryTargets and run npx prisma generate during build.

Rebuild production image:

    docker build -f dockerfile -t backend --no-cache .

## Troubleshooting

- Prisma engine errors: Ensure prisma generate matches runtime and install OpenSSL if needed.
- Invalid DATABASE_URL: Use file: scheme and load .env before PrismaClient.
- React Query: Use options objects with queryKey / queryFn; check mutation.status === 'pending' for loading state.

## Useful Commands

Backend:

    cd backend
    npm install
    npx prisma generate
    npx prisma db push
    npm test

Frontend:

    cd frontend
    npm install
    npm start

## Contributing

- Run tests and lint before pushing.
- Keep .env out of version control.
