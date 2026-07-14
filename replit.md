# TripHop Archive Map

An interactive, dark "archive terminal"-styled map of trip-hop music history (1980–present) — drag to explore a network of 73 artists and 298 songs, click nodes to open artist/song detail panels, and build custom playlists. Ported from an imported Vercel/v0 project into the Replit pnpm workspace.

## Run & Operate

- Preview: the `artifacts/triphop-map: web` workflow serves the app at `/`.
- `pnpm --filter @workspace/triphop-map run dev` — run the web app directly (workflow-managed; do not run manually in dev)
- `pnpm --filter @workspace/triphop-map run typecheck` — typecheck the app
- `pnpm --filter @workspace/triphop-map run build` — production build (needs `PORT`/`BASE_PATH` env, normally supplied by the workflow)
- `pnpm --filter @workspace/api-server run dev` — run the shared API server (health check only so far; the app doesn't yet use it)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, Tailwind CSS, Radix UI primitives, Framer Motion (`motion`)
- Data: static in-repo dataset (`src/data/artists.ts`, `playlists.ts`, etc.) — no database used
- Auth/storage (optional, not currently configured): Supabase (`@supabase/supabase-js`), reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- Optional integrations wired but unconfigured: Spotify OAuth (`VITE_SPOTIFY_CLIENT_ID`/`VITE_SPOTIFY_REDIRECT_URI`), Sentry (`VITE_SENTRY_DSN`) — app runs fine without them, these features just degrade gracefully

## Where things live

- `artifacts/triphop-map/src/App.tsx` — main single-page app (landing screen → map view), most state lives here
- `artifacts/triphop-map/src/components/` — map, panels (artist/song/wiki/playlist/geo/sound-DNA), search
- `artifacts/triphop-map/src/data/` — the artist/song/playlist dataset that drives the whole app
- `artifacts/triphop-map/src/contexts/AuthContext.tsx` — Supabase-backed auth (optional; inert without Supabase env vars)
- `artifacts/api-server/` — shared Express API scaffold (health check only; unused by this app so far)
- `.migration-backup/` — original imported Vercel project tree, kept for reference; not part of the running app

## Architecture decisions

- The original app was Vite + React already (not Next.js), so no framework conversion was needed — porting was mostly re-registering it as a Replit artifact and wiring the workflow.
- `src/routes.tsx` is unused scaffold boilerplate; `App.tsx` renders directly without a router since the whole experience is a single view with internal panel state.
- `src/data/batch_d.ts` is an empty placeholder left over from the original project (unreferenced anywhere) — harmless, left as-is per "don't fix pre-existing bugs".

## Product

- Landing screen with app stats, "Enter Archive" CTA.
- Force-directed / physics map of artists; click a node to open an artist panel (bio, songs, similar artists).
- Song detail panel, curated playlists, "sound DNA" similarity view, geographic view, deep cuts, mood/era/year filters, shareable playlist links via URL hash.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- If you need real auth, Spotify linking, or error tracking, request `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SPOTIFY_CLIENT_ID`, `VITE_SPOTIFY_REDIRECT_URI`, or `VITE_SENTRY_DSN` via the environment-secrets flow — none are currently set.
- `pnpm install` / `pnpm run typecheck` / `pnpm --filter @workspace/triphop-map run build` all pass cleanly as of the port.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
