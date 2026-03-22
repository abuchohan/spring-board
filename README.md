# Spring Board

A full-stack starter kit with auth, database, and UI pre-configured.

> This is a template. Before using it, go through the checklist below to make it your own.

---

## Customize for Your Project

### 1. Rename "Spring Board"

Search and replace `Spring Board` / `spring-board` / `springboard` with your app name in:

- `client-react/src/Pages/LandingPage/LandingPage.tsx` — navbar logo, hero text, footer copyright
- `package.json` (root, `server/`, `client-react/`) — `"name"` fields
- This README

### 2. Update the Landing Page

Edit `client-react/src/Pages/LandingPage/LandingPage.tsx`:

- Hero headline and description
- Feature cards (titles, descriptions, icons)
- GitHub link (`https://github.com/your-repo`)
- Footer links (Privacy, Terms, Twitter/social)
- Footer copyright year and name

### 3. Configure Environment Variables

**Backend** — copy and fill in:
```bash
cp server/.env.example server/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `MAILTRAP_TOKEN` | API token from [mailtrap.io](https://mailtrap.io) (for password reset emails) |
| `FRONTEND_URL` | Your frontend URL (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

**Frontend** — create `client-react/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
```

Update `VITE_API_URL` to your deployed backend URL when going to production.

### 4. Set Up the Database

```bash
cd server
npx prisma db push     # apply schema
npx prisma db seed     # optional: seed initial data
```

---

## Running Locally

```bash
pnpm install
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui, Redux Toolkit, React Router v7
- **Backend:** Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Auth:** Session-based (httpOnly cookie), password reset via email
