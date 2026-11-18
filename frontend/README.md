# ProductMatch Routing (frontend)

React + TypeScript dashboard (Vite) for the ProductMatch Routing API.

```
src/
├── api/client.ts        typed API client (all HTTP calls live here)
├── types/api.ts         response types, mirror backend/.../api/schemas.py
├── hooks/useAsync.ts    data loading with stale-response protection
├── components/          ApiStatus, KpiCards, RouterTable, PairsTable, DecisionBadge
├── pages/               DashboardPage
├── lib/format.ts        number formatting
└── styles/global.css    design tokens, light and dark mode
```

## How it connects to the backend

The app calls relative URLs under `/api/v1`. In development, Vite forwards `/api` to the
FastAPI server on `http://localhost:8000` (see `vite.config.ts`). In Docker, nginx does the
same (see `nginx.conf`). No CORS setup is needed in either case.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_PROXY` | `http://localhost:8000` | Where the dev server forwards `/api` |
| `VITE_API_BASE_URL` | `/api/v1` | Base path the browser calls |

## Commands

```bash
npm install
npm run dev         # http://localhost:5173 (backend must be running on :8000)
npm run typecheck
npm run build       # production build in dist/
```

When the API changes, update `src/types/api.ts` to match `backend/.../api/schemas.py`.
