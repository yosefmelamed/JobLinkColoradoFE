# Job Board Frontend

This is a minimal Next.js + Tailwind CSS frontend scaffolded to integrate with the job-board-backend.

Quick start

1. Install dependencies:

```bash
cd job-board-frontend
npm install
```

2. Create `.env.local` with your backend URL:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Start dev server:

```bash
npm run dev
```

Auth

- Sign up: POST `/auth/signup` is called from `/auth/signup` page.
- Log in: POST `/auth/login` is called from `/auth/login` page. The example stores `token` in `localStorage` if returned.

Tailwind

Tailwind is already configured. If you need to initialize with the tailwind CLI after installing, run:

```bash
npx tailwindcss init -p
```

Notes

- Configure CORS on your backend or set `NEXT_PUBLIC_API_URL` to the correct backend URL.
- This is a minimal starter — expand components, auth flows, and styling as needed.
