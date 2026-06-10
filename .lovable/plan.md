## What's actually broken

The model cards are stuck rendering as skeleton placeholders on the client, so clicks do nothing. Underneath, `ModelCard` already wraps everything in a `<Link to="/models/$slug">` and `src/routes/models.$slug.tsx` already shows a "Buy on Cults3D" purchase button — so the routing and purchase UI exist. The real issue is a **hydration mismatch**:

- The route loader prefetches Cults models on the server, so SSR renders real `<a href="/models/...">` cards.
- The client's `QueryClient` is created fresh with no dehydrated state, so on hydration `useQuery` reports `isLoading: true` and re-renders `<ModelCardSkeleton />`.
- React detects the `<a>` vs `<div>` mismatch (visible in the runtime error), discards the SSR tree, and the page settles on non-interactive skeletons.

A secondary mismatch source: `ModelCard` formats `publishedAt` with `toLocaleDateString(undefined, ...)`, which yields different text on server vs client locales.

## Fix

1. **Wire SSR ↔ Query hydration** so loader-prefetched data is available on the client without a refetch flash.
   - Add the dependency `@tanstack/react-router-with-query`.
   - In `src/router.tsx`, wrap the router with `routerWithQueryClient(router, queryClient)` so the QueryClient cache is dehydrated into the SSR payload and rehydrated on the client.

2. **Make date formatting deterministic** in `src/components/ModelCard.tsx` — format with fixed parts (`en-US`, explicit month/day/year) so server and client produce identical strings.

3. **Verify behaviour** end-to-end after build:
   - Home page Featured / Latest grids render real cards on first paint (no skeleton flash).
   - Clicking any card navigates to `/models/<slug>`.
   - Detail page shows the existing "Buy on Cults3D" CTA (already implemented) opening the Cults3D listing in a new tab.

No changes are needed to `ModelCard` link wiring, the `/models/$slug` route, or the purchase button — those already exist and will start working as soon as hydration is fixed.

## Files touched

- `package.json` / lockfile — add `@tanstack/react-router-with-query`.
- `src/router.tsx` — wrap with `routerWithQueryClient`.
- `src/components/ModelCard.tsx` — deterministic date formatter.
