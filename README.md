# Speedway Admin

Admin portal for the taxi speed-limit management system. React 18 + Vite + TypeScript, Tailwind CSS, TanStack Query, React Router v6, Recharts, and Leaflet.

## Getting started

```bash
npm install
npm run dev
```

The app runs entirely on **mock data** by default so you can preview every screen without the NestJS backend running. Sign in with any email/password on the login screen (use an email containing "user" to preview the access-denied screen for non-admins).

## Connecting the real backend

1. Copy `.env.example` to `.env` if you haven't already.
2. Set `VITE_API_URL` to your NestJS API's base URL.
3. Set `VITE_MOCK_API=false`.

All API calls in `src/api/*` are already typed against the endpoints in the brief (`/auth/*`, `/admin/*`, `/roads`, `/segments/*`, `/zones`). Once mock mode is off, they hit the real endpoints — no other code changes needed.

Note: `POST /roads/:id/segments` isn't part of the roads list response, so `createRoad` calls it once per segment after creating the road, then refetches. If your backend accepts segments inline on road creation, you can simplify `src/api/roads.ts::createRoad`.

## Project structure

```
src/
  api/          axios instance + typed API functions per resource, with mock-mode fallback
  components/ui shared UI primitives (Button, Card, Dialog, Table, Badge, Toast, ...)
  contexts/     AuthContext (in-memory token) and ToastContext
  features/     one folder per domain area, each with hooks.ts + page components
  layouts/      Sidebar, Topbar, AppLayout
  pages/        Login, Access Denied, 404
  routes/       ProtectedRoute (auth + ADMIN-only guard)
  types/        shared domain types
```

## Auth model

- Access token lives in memory only (`src/api/client.ts`), never in `localStorage`.
- Refresh token is expected as an httpOnly cookie set by the backend; the axios instance sends `withCredentials: true` and calls `POST /auth/refresh` automatically on a 401, retrying the original request once.
- If refresh fails, the session is cleared and the user is redirected to `/login`.
- `ProtectedRoute` also enforces `role === 'ADMIN'`; any other role lands on `/access-denied`.

## Design notes

Palette is neutral zinc/gray with a single indigo accent (`#5B5BD6`), a near-black sidebar, Inter for UI text, and JetBrains Mono for coordinates/data. Stat cards, tables, and destructive-action confirmations follow the brief's Linear/Vercel/Stripe direction — subtle borders over heavy shadows, tabular numerals for data-dense figures.
