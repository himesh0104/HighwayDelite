# BookIt: Experiences & Slots

Tiny fullstack app where people browse experiences, pick a time, and book. I kept the code simple so I could actually finish it

- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: Node.js + Express + Prisma + MongoDB (yes, Mongo — easier for me to seed quickly)

## Project structure

```
backend/
frontend/
```

## Backend (Express + Prisma + Mongo)

1) Env setup (create `backend/.env`):
```
DATABASE_URL="mongodb+srv://<user>:<pass>@<cluster>/bookit?retryWrites=true&w=majority"
PORT=4000
ALLOWED_ORIGIN=http://localhost:3000
```

2) Install + generate + seed
```
cd backend
npm install
npx prisma generate
node prisma/seed.js   # quick seed with a couple experiences + slots
```

3) Run the API
```
npm run dev
```

API endpoints (all JSON):
- GET `/experiences` → list with slots
- GET `/experiences/:id` → single experience with slots
- POST `/bookings` → body: { name, email, experienceId, slotId, quantity?, promoCode? }
- POST `/promo/validate` → body: { code } (supports SAVE10, FLAT100 in seed)

Notes (backend):
- Simple validation (name/email exist, slot capacity, etc.).
- Uses a transaction to decrement slot capacity so we don’t double-book.
- Errors are friendly-ish; logs are basic on purpose.

## Frontend (Next.js)

1) Env setup (create `frontend/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

2) Install + run
```
cd frontend
npm install
npm run dev
```

Pages:
- `/` Home → shows cards (images from Unsplash)
- `/experiences/[id]` → details page with choose date/time + quantity
- `/checkout` → summary, promo code apply, confirm
- `/result` → success/failure message

Notes (frontend):
- I used `next/image` with `sizes` so Lighthouse doesn’t scream at me.
- State is just React hooks; no global store (kept it straightforward).
- UI is intentionally clean but basic. TODOs sprinkled around for polish.

## Deployment (what I’d do)
- Backend → Render/Railway. Set `DATABASE_URL`, `ALLOWED_ORIGIN`, run `npx prisma generate` and start.
- Frontend → Vercel. Set `NEXT_PUBLIC_API_URL` to your backend URL.

## Final note
Built as part of a Full Stack Developer Intern assignment. Code’s not perfect but works fine for demo purposes. Some improvements can be made later once I learn more.
