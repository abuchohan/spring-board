# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spring Board is a monorepo using **Turbo** + **pnpm workspaces** with two packages:
- `server/` — Express.js + TypeScript backend on port 5000
- `client-react/` — React 19 + Vite frontend on port 5173

## Commands

### Development
```bash
pnpm dev           # Run both server and client concurrently via Turbo
```

Or run individually:
```bash
cd server && pnpm dev          # tsx watch index.ts
cd client-react && pnpm dev    # vite
```

### Build
```bash
pnpm build         # Build both packages (server: prisma generate && tsc, client: tsc -b && vite build)
```

### Type Checking
```bash
pnpm check-types   # Run tsc --noEmit across all packages
```

### Linting (client only)
```bash
cd client-react && pnpm lint
```

### Database (Prisma)
```bash
cd server
npx prisma db push                 # Sync schema to DB (dev, no migration history)
npx prisma migrate dev             # Create migration + apply (production-ready)
npx prisma db seed                 # Seed the database (tsx prisma/seed.ts)
npx prisma studio                  # Open Prisma Studio GUI
npx prisma generate                # Regenerate client after schema changes
```

## Architecture

### Backend (`server/`)

- **Entry:** `index.ts` → `app.ts` (Express setup with CORS, cookies, JSON body parser)
- **Routes:** All prefixed with `/api`. Auth routes at `/api/auth`
- **Auth:** Session-based. On login, a `Session` record is created in the DB and a `session_id` httpOnly cookie is set (3-day expiry)
- **Session middleware:** `middleware/verifySession.middleware.ts` — validates the cookie against the DB and attaches `req.user` and `req.session` to the request. Apply to any protected route
- **Password reset:** Token-based (15-min expiry), delivered via Mailtrap/Nodemailer. Token is invalidated after use or on password change
- **Database:** PostgreSQL via Prisma. Schema at `prisma/schema.prisma` — models: `User`, `Session`, `PasswordReset`
- **Environment:** Copy `server/.env.example` to `server/.env` and fill in `DATABASE_URL`, `MAILTRAP_TOKEN`, `FRONTEND_URL`

### Frontend (`client-react/`)

- **Entry:** `src/main.tsx` → Redux Provider + ThemeProvider → `App.tsx`
- **Routing:** React Router v7 defined in `src/routes/root.tsx`. Two route guards: `ProtectedRoute` (redirects to `/login` if unauthenticated) and `PublicRoute` (redirects to `/dashboard` if authenticated)
- **State:** Redux Toolkit in `src/redux/`. Auth slice tracks `isAuthenticated`, `user`, and `status` (`'idle' | 'checking' | 'authenticated' | 'unauthenticated'`). `App.tsx` dispatches `fetchSession()` on mount to restore session
- **Auth thunks:** `src/redux/auth/authThunks.ts` — all API calls for auth (login, register, logout, password reset flow)
- **API base URL:** Set via `VITE_API_URL` env var (default: `http://localhost:5000/api`)
- **UI:** shadcn/ui components (Radix UI primitives) in `src/components/ui/`. Tailwind CSS v4. Animations with Framer Motion. Toasts via Sonner
- **Forms:** React Hook Form + Zod for validation
- **Path alias:** `@` maps to `src/`

### Auth API endpoints (`/api/auth`)

| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, sets `session_id` cookie |
| POST | `/logout` | Yes | Deletes session, clears cookie |
| GET | `/me` | Yes | Returns user + **refreshes session expiry by 3 days** |
| POST | `/reset-password` | No | Request password reset email |
| GET | `/reset-password/:token/validate` | No | Check token validity |
| POST | `/reset-password/:token` | No | Set new password, invalidates all sessions |

In non-production (`NODE_ENV !== 'production'`), the reset token is also returned in the response body for easier testing.

### Frontend routes

| Path | Guard | Component |
|------|-------|-----------|
| `/` | Public | `LandingPage` |
| `/login` | PublicRoute | `LoginPage` |
| `/register` | PublicRoute | `RegisterPage` |
| `/forgot-password` | PublicRoute | `ResetPasswordPage` |
| `/reset-password/:resetToken` | PublicRoute | `ResetPasswordTokenPage` |
| `/dashboard` | ProtectedRoute | `DashboardPage` |
| `/dashboard/profile` | ProtectedRoute | `ProfilePage` |

### Pages & layouts
- `src/Pages/LoginFlow/` — Login, Register, ForgotPassword, ResetPassword pages
- `src/Pages/Dashboard/` — Main dashboard
- `src/Pages/LandingPage/` — Public landing page
- `src/Pages/Profile/` — User profile
- `src/Pages/NotFound/` — 404 catch-all
- `src/layouts/` — `DashboardLayout`, `LoginLayout`, `AppSidebar`, `SiteHeader`

## Key Conventions

- Sessions are stored in the DB, not JWTs. Cookie name is `session_id`
- All sessions for a user are cleared when they reset their password
- The client uses `credentials: 'include'` on all fetch calls to send the session cookie
- Email inputs must be sanitized with `.trim().toLowerCase()` in both the Zod schema (client) and the controller (server) before any DB lookup
- On protected routes, `req.user` has shape `{ id, email, name, avatar }` and `req.session` has `{ id, userId, expiresAt }`
- Server imports use `.js` extensions (ESM): e.g. `import foo from './foo.js'` even for `.ts` source files
- No test framework is configured yet

## Brand / Theming

Tailwind CSS v4 with a custom palette defined as oklch in `client-react/src/index.css`:

| Token | Hex | Use |
|-------|-----|-----|
| `primary` | `#2B2D31` | Buttons, key actions |
| `secondary` | `#7F77DD` | Accents, highlights |
| `accent` | `#C5A059` | Gold accents |
| `background` | `#F7F6F2` | Page background (light) |
