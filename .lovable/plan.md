## Goal
Make `/admin/settings` reliably render a visible Cults3D settings form instead of a blank page.

## Root cause found
The route tree shows `/admin/settings` is registered as a child of `/admin`, but `src/routes/_authenticated/admin.tsx` is currently a parent route that only redirects and does not render an `<Outlet />`. Because child routes render through the parent outlet, the settings page can match but never display.

## Implementation plan
1. Update the `/admin` parent route so it renders `<Outlet />` for child pages.
2. Move the `/admin` to `/admin/settings` redirect into an index child route, so visiting `/admin` still lands on settings without blocking `/admin/settings`.
3. Add a route-level error boundary for Admin Settings that displays:
   - Error message
   - Error details
   - Retry button
4. Adjust the settings page copy/buttons to match the requested visible UI:
   - Heading: `Cults3D Settings`
   - Fields: `Cults3D Username`, `Cults3D API Key`
   - Buttons: `Save Settings`, `Test Connection`
5. Ensure unauthenticated access shows a clear sign-in message instead of a blank page by making the auth gate render a visible message while redirecting.

## Files to change
- `src/routes/_authenticated/admin.tsx`
- Add `src/routes/_authenticated/admin.index.tsx`
- `src/routes/_authenticated/admin.settings.tsx`
- `src/routes/_authenticated/route.tsx`