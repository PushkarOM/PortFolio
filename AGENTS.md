# PushkarOS Portfolio

A monorepo portfolio site built with React 19 + Vite + Tailwind CSS (frontend) and Express + Mongoose (backend), deployed on Vercel.

## Project Structure

```
PortFolio/
├── frontend/              # React/Vite frontend (Vercel Service)
│   └── src/
│       ├── app/           # Root App component
│       ├── context/       # WindowContext (window open/close state)
│       ├── features/
│       │   ├── cms/       # StudioCMS (in-app content editor)
│       │   ├── desktop/   # OS-shell UI (TopBar, BottomDock, SideWidgets, BootScreen, DesktopIcons)
│       │   └── portfolio/ # Portfolio windows (Hero, Projects, Experience, Skills, Resume, Contact, Terminal)
│       ├── shared/
│       │   ├── components/ # WindowFrame (reusable draggable window wrapper)
│       │   ├── services/   # api.ts — all backend calls + localStorage fallback
│       │   ├── types/      # index.ts — shared TypeScript interfaces (no imports from project files)
│       │   └── utils/      # constants.ts — DEFAULT_* fallback data arrays
│       └── styles/        # global.css
├── backend/               # Express/Mongoose API (Vercel Service)
│   ├── seed.js            # One-time DB seed script — requires ADMIN_INITIAL_PASSWORD env var
│   └── src/
│       ├── app.js         # Express app: CORS, JSON, route binding
│       ├── server.js      # Entry point: validates ENV, connects DB, starts HTTP server
│       ├── config/
│       │   └── db.js      # Mongoose connection
│       ├── middleware/
│       │   └── auth.middleware.js  # JWT verification middleware
│       └── modules/
│           ├── auth/      # auth.routes.js, auth.model.js (User)
│           ├── contact/   # contact.routes.js, contact.model.js (Message)
│           ├── github/    # github.routes.js (live GitHub stats via API)
│           ├── portfolio/ # portfolio.routes.js (Projects, Experience, Skills)
│           └── settings/  # settings.routes.js, settings.model.js (key-value store)
└── vercel.json            # Routes /api/* → backend service, everything else → frontend service
```

## Development

Both services must be running simultaneously. Start each in its own terminal:

```bash
# Terminal 1 — frontend
cd frontend && pnpm run dev     # runs on http://localhost:5173

# Terminal 2 — backend
cd backend && pnpm run dev      # runs on http://localhost:5000
```

Frontend hot-reloads automatically. Backend uses `node --watch`.

## Key Files to Know

- `frontend/src/shared/services/api.ts` — central API layer. All backend calls go here. GET requests fall back to localStorage when offline; POST/DELETE mutations surface errors to the caller.
- `frontend/src/shared/types/index.ts` — canonical TypeScript interfaces (Project, Experience, etc). Import types from here — NOT from `api.ts` or `constants.ts` — to avoid circular imports.
- `frontend/src/shared/utils/constants.ts` — static fallback data. Used as defaults when the backend is unreachable.
- `backend/src/server.js` — validates `JWT_SECRET` at startup (exits if missing/shorter than 32 chars). Also connects MongoDB before binding the HTTP port.
- `backend/seed.js` — run once on fresh DB. Requires `ADMIN_INITIAL_PASSWORD` env var — see `backend/.env.example`.

## Styling

This project uses **Tailwind CSS v4** for styling. Use Tailwind utility classes directly in JSX. Tailwind is loaded via the Vite plugin — no PostCSS config needed.

## Security Notes

- **Admin password**: The hardcoded `pushkar123` default has been removed. To seed a fresh DB, set `ADMIN_INITIAL_PASSWORD` in the backend environment, run `node seed.js` once, then remove that env var. Change the password immediately via the in-app StudioCMS "Change Password" flow.
- **JWT_SECRET**: Must be set in Vercel environment variables (Production + Preview) and must be ≥ 32 characters. The server will exit at startup if it's missing or too short.
- **Rate limiting**: `/api/auth/login` is limited to 5 requests / 15 min per IP. `/api/contact` is limited to 5 requests / hour per IP. `trust proxy` is enabled for correct IP resolution behind Vercel's edge.
- The old `backend/middleware/auth.js` (which contained `|| 'fallback_secret'`) has been deleted. Do not recreate it.
