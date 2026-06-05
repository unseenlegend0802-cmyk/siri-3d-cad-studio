# Final Update — Cults3D-Powered Catalog

Switch the Siri3DCAD Studio site to use **Cults3D as the single source of truth**, with an admin-only settings page to manage API credentials. All Sketchfab code is removed. Current dark-fantasy design, animations, and branding are preserved verbatim.

## Architecture

```text
Cults3D GraphQL (https://cults3d.com/graphql, HTTP Basic Auth)
        │
        ▼
createServerFn (cults.functions.ts)  ──reads creds──>  studio_settings table (admin-only)
        │
        ├── getCultsModels()      → list (cached, paginated client-side)
        ├── getCultsModelBySlug() → detail page
        ▼
TanStack Query (15 min staleTime) → Homepage + /models + /models/$slug
```

## Backend (Lovable Cloud)

### Tables
- `studio_settings` — single row keyed `id='singleton'`, columns `cults_username text`, `cults_api_key text`, `updated_at`. RLS: read/write only via `has_role(auth.uid(),'admin')`. Read on the server via `supabaseAdmin` from server functions.
- `user_roles` — standard pattern (`app_role` enum with `admin`, `user`), plus `has_role()` security-definer function. First signed-up user is auto-promoted to admin via DB trigger (only if no admin exists yet).

### Auth
- Email/password only (admin-only surface — no public signup CTA, but `/auth` page exists).
- `_authenticated` layout gates `/admin`.

### Server functions (`src/lib/cults.functions.ts`)
- `getCultsModels({ count })` — GraphQL `creations(user: "Siri3DCAD", limit, sort)` returning normalized DTO `{ slug, name, description, price, tags, illustrationUrl, illustrationUrls[], url, likesCount, downloadsCount, publishedAt }`. Returns `{ models: [], error }` on failure (graceful).
- `getCultsModelBySlug({ slug })` — single creation + related (same tag).
- `getStudioSettings()` (admin-only, via `requireSupabaseAuth` + role check) and `updateStudioSettings({ username, apiKey })`.
- All Cults3D fetches read creds at request time from `studio_settings` via `supabaseAdmin`; if missing, return graceful empty state so the site never crashes.

## Frontend changes

### Files removed
- `src/lib/sketchfab.functions.ts`
- `src/components/DragonModal.tsx` (replaced by dedicated detail route)
- `src/routes/dragons.tsx` → redirects to `/models` (kept thin)

### Homepage (`src/routes/index.tsx`) — new section order
1. Hero (unchanged copy + styling)
2. **Featured Collection** — auto: top 3 by `likesCount`
3. **Model of the Week** — auto: deterministic pick = `models[weekOfYear % models.length]`, large hero card
4. **Latest Models** — newest 6 by `publishedAt`
5. **Categories** — grid of category chips (reuses `model-categories.ts` heuristics) linking to `/models?category=…`
6. Commissions (unchanged)
7. Contact (unchanged)

### `/models` catalog
- Server-fed initial data, client-side search + category filter + 12-per-page pagination (same UX as today, swapped data source).

### `/models/$slug` — new dedicated detail route
- Image gallery (illustrationUrls), name, price, tags, full description (HTML sanitized), download/like counters, **"Buy on Cults3D"** CTA → `model.url`, plus a Related Models row.
- Per-route `head()` with og:title/description/image from model data.

### `/admin` (under `_authenticated`)
- Form: Cults3D username + API password (masked), Save button, last-updated stamp, "Test connection" button that pings GraphQL and reports OK/fail.
- That's the only field set there — Featured / MOTW are automatic per choice.

### Navigation
- Header: Home · Models · Commissions · Contact (+ Admin link only when signed-in admin).

## SEO
- `head()` per route with Cults3D-specific keywords retained from current build.
- `/models/$slug` emits JSON-LD `Product` schema with price, image, brand.

## Out of scope (per your answers)
- No manual featured/MOTW picker UI (auto).
- No public user accounts (admin-only auth).
- No webhook from Cults3D (they don't offer one) — freshness is via 15-min cache TTL; first visitor after expiry triggers refetch.

## Risks / notes
- Cults3D GraphQL is rate-limited and Basic-Auth gated; the cache + graceful fallbacks handle outages without breaking the site.
- "Origins must be approved by Cults support" applies only to their *Share-on-Create* embed widget, not to the GraphQL API — our integration doesn't need it.
- If `studio_settings` is unconfigured at launch, the site renders empty-state cards prompting admin to configure creds.

Confirm and I'll implement in one pass: enable Cloud → migrations → server fns → remove Sketchfab → rebuild homepage + routes + admin.
