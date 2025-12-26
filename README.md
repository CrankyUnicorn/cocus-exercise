# CocusTest

Monorepo with frontend and backend for the Feature Flags project.

## Structure

- `/backend` — Node/TypeScript API using Express + Prisma (SQLite in dev)
- `/frontend` — React + TypeScript client (uses React Query)
- `/prisma` — Prisma schema (for backend)

## Prerequisites

- Node 20 / npm (project tested with Node 20.19.5)
- Docker
- git

## Environment

Create `.env` files in the `backend` folder (do not commit):

- backend/.env
  ```
  DATABASE_URL="file:./prisma/dev.db"
  ```

For container builds, prefer an absolute path or set via `--env-file` / docker-compose.

## Backend — Local dev

1. Install deps
   ```bash
   cd backend
   npm install
   ```

2. Ensure Prisma schema & DB file:
   ```bash
   # create folder & sqlite file if missing
   mkdir -p prisma
   touch prisma/dev.db
   chmod 0666 prisma/dev.db
   ```

3. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run backend (dev):
   ```bash
   # TypeScript dev mode (ts-node-dev must be installed)
   npm run dev   # or `npx ts-node-dev --respawn --transpile-only src/server.ts`
   ```

5. Tests:
   ```bash
   npm test
   ```

Notes:
- If you see Prisma binary errors in containers (e.g. linux-musl), add the appropriate `binaryTargets` in `prisma/schema.prisma` and run `npx prisma generate` in the target environment (or during Docker build).
- Ensure `DATABASE_URL` has the `file:` scheme and points to a valid path.

## Frontend — Local dev

1. Install deps
   ```bash
   cd frontend
   npm install
   ```

2. Start dev server
   ```bash
   npm start
   # or react-scripts / Vite command depending on the project
   ```

3. The frontend expects the backend at `http://localhost:3000` by default. Set `REACT_APP_BACKEND_URL` in frontend env to override.

## Docker

Two Dockerfiles are provided:

- `dockerfile.dev` — development image (ts-node-dev). Use for local containerized dev.
- `dockerfile` — production multi-stage build (build + runtime).

Important:
- Ensure OpenSSL and libc compat are available in the image (alpine musl builds need `libc6-compat` and `openssl`).
- Add container runtime binary target in `prisma/schema.prisma` (example below) and run `npx prisma generate` during the image build so prisma engines for the container are included.

Example `generator` block for many targets:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
}
```

Rebuild image after changing `schema.prisma`:
```bash
docker build -f dockerfile -t backend --no-cache .
```

## Troubleshooting

- Prisma ClientInitializationError / missing engine:
  - Ensure `prisma generate` was run in the environment matching runtime (inside image or include correct `binaryTargets`).
  - Install OpenSSL in the image: Alpine -> `apk add --no-cache openssl libc6-compat`. Debian -> `apt-get install -y libssl-dev`.

- Invalid DATABASE_URL / parsing errors:
  - Use `file:` scheme for SQLite (e.g. `file:./prisma/dev.db` or absolute `file:/abs/path/prisma/dev.db`).
  - Confirm `.env` is loaded before PrismaClient is constructed.

- TypeScript / React Query:
  - Use the `useQuery` / `useMutation` options object form with `queryKey` / `queryFn`.
  - Mutation loading state: check `mutation.status === 'pending'` (React Query v4).

## Useful commands

From repository root:
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm test

# Frontend
cd frontend
npm install
npm start
```

## Contributing

- Run tests and lint before pushing.
- Keep `.env` out of version control.

If you want, I can add CI scripts, a docker-compose file, or a convenience npm script to run both services.// filepath: /home/dev/CocusTest/README.md
# CocusTest

Monorepo with frontend and backend for the Feature Flags project.

## Structure

- `/backend` — Node/TypeScript API using Express + Prisma (SQLite in dev)
- `/frontend` — React + TypeScript client (uses React Query)
- `/prisma` — Prisma schema (for backend)

## Prerequisites

- Node 18+ / npm (project tested with Node 20)
- Docker (optional, for container builds)
- git (optional)

## Environment

Create `.env` files in the `backend` folder (do not commit):

- backend/.env
  ```
  DATABASE_URL="file:./prisma/dev.db"
  ```

For container builds, prefer an absolute path or set via `--env-file` / docker-compose.

## Backend — Local dev

1. Install deps
   ```bash
   cd backend
   npm install
   ```

2. Ensure Prisma schema & DB file:
   ```bash
   # create folder & sqlite file if missing
   mkdir -p prisma
   touch prisma/dev.db
   chmod 0666 prisma/dev.db
   ```

3. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run backend (dev):
   ```bash
   # TypeScript dev mode (ts-node-dev must be installed)
   npm run dev   # or `npx ts-node-dev --respawn --transpile-only src/server.ts`
   ```

5. Tests:
   ```bash
   npm test
   ```

Notes:
- If you see Prisma binary errors in containers (e.g. linux-musl), add the appropriate `binaryTargets` in `prisma/schema.prisma` and run `npx prisma generate` in the target environment (or during Docker build).
- Ensure `DATABASE_URL` has the `file:` scheme and points to a valid path.

## Frontend — Local dev

1. Install deps
   ```bash
   cd frontend
   npm install
   ```

2. Start dev server
   ```bash
   npm start
   # or react-scripts / Vite command depending on the project
   ```

3. The frontend expects the backend at `http://localhost:3000` by default. Set `REACT_APP_BACKEND_URL` in frontend env to override.

## Docker

Two Dockerfiles are provided:

- `dockerfile.dev` — development image (ts-node-dev). Use for local containerized dev.
- `dockerfile` — production multi-stage build (build + runtime).

Important:
- Ensure OpenSSL and libc compat are available in the image (alpine musl builds need `libc6-compat` and `openssl`).
- Add container runtime binary target in `prisma/schema.prisma` (example below) and run `npx prisma generate` during the image build so prisma engines for the container are included.

Example `generator` block for many targets:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
}
```

Rebuild image after changing `schema.prisma`:
```bash
docker build -f dockerfile -t backend --no-cache .
```

## Troubleshooting

- Prisma ClientInitializationError / missing engine:
  - Ensure `prisma generate` was run in the environment matching runtime (inside image or include correct `binaryTargets`).
  - Install OpenSSL in the image: Alpine -> `apk add --no-cache openssl libc6-compat`. Debian -> `apt-get install -y libssl-dev`.

- Invalid DATABASE_URL / parsing errors:
  - Use `file:` scheme for SQLite (e.g. `file:./prisma/dev.db` or absolute `file:/abs/path/prisma/dev.db`).
  - Confirm `.env` is loaded before PrismaClient is constructed.

- TypeScript / React Query:
  - Use the `useQuery` / `useMutation` options object form with `queryKey` / `queryFn`.
  - Mutation loading state: check `mutation.status === 'pending'` (React Query v4).

## Useful commands

From repository root:
```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm test

# Frontend
cd frontend
npm install
npm start
```

## Contributing

- Run tests and lint before pushing.
- Keep `.env` out of version control.
