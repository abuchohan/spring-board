# Spring Board

A full-stack starter kit with auth, database, and UI pre-configured.

> This is a template. Before using it, go through the checklist below to make it your own.

---

## Template Checklist

Go through these when you clone this for a new project. Delete this section from your README when done.

### Identity
- [ ] Search and replace `Spring Board` / `spring-board` / `springboard` with your app name
  - `client-react/src/Pages/LandingPage/LandingPage.tsx` — navbar logo, hero text, footer copyright
  - `package.json` (root, `server/`, `client-react/`) — `"name"` fields
  - This README title and overview
- [ ] Update `README.md` to describe your app (replace this file's content)

### Landing Page
- [ ] Edit `client-react/src/Pages/LandingPage/LandingPage.tsx`:
  - Hero headline and description
  - Feature cards (titles, descriptions, icons)
  - GitHub link (`https://github.com/your-repo`)
  - Footer links (Privacy, Terms, social)
  - Footer copyright year and name

### Theme & Branding
- [ ] Update color tokens in `client-react/src/index.css` (oklch values for `primary`, `secondary`, `accent`, `background`)
- [ ] Update font if needed (currently system default via Tailwind)

### Auth & Email
- [ ] Set your Resend API key in `server/.env` (`RESEND_API_KEY`)
- [ ] Update the sender address in `server/services/email.service.ts` (currently hardcoded)
- [ ] Update email template copy/styles in the email service
- [ ] Test password reset flow end-to-end

### Environment Variables

**Backend** — copy and fill in:
```bash
cp server/.env.example server/.env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) (for password reset emails) |
| `FRONTEND_URL` | Your frontend URL (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

**Frontend** — create `client-react/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
```

Update `VITE_API_URL` to your deployed backend URL in production.

### Database
- [ ] Update `server/prisma/schema.prisma` with your app's models (extend or keep User, Session, PasswordReset)
- [ ] Run `npx prisma db push` inside `server/` to apply schema
- [ ] Update `server/prisma/seed.ts` with your seed data, then `npx prisma db seed`

### Cleanup
- [ ] Delete this checklist once done

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
