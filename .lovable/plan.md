## Goal

Turn `/auth` into a private, admin-only login. Only your account exists; the page no longer offers signup. Once logged in, `/admin` (already built) is where you save your Cults3D username + API key.

## Current state

- `/auth` exists with both Sign in and Sign up tabs.
- `/admin` already has a Cults3D username + API key form, behind the `_authenticated` gate + in-handler admin role check.
- DB trigger `handle_new_user_admin_bootstrap` auto-promotes the first signup to admin.
- **No admin account exists yet** (zero users in the database).

## What changes

### 1. Create your admin account (one-time)

After this plan is approved I'll prompt you to:
1. Open `/auth` and sign up with your email + password (8+ chars). The trigger promotes you to admin automatically.
2. Confirm your email if Supabase asks (Lovable Cloud sends a confirmation link).
3. Tell me you're in — that's the trigger to lock the door behind you.

### 2. Lock signups (DB migration)

After your account exists:

- Replace `handle_new_user_admin_bootstrap` with a hardened version: if an admin already exists, the trigger **raises an exception**, rejecting any new signup at the database level. No second account can ever be created, even if signup is somehow re-enabled.
- Also call `supabase--configure_auth` to turn off public signups via the Auth API as a second layer.

### 3. Strip signup UI from `/auth`

- Remove the Sign up tab and the "First time? Create the admin account →" toggle.
- Page becomes a single email + password form titled "Studio Access — Sign in".
- Keep the dark-fantasy styling (Embers, ember border, gradient button) exactly as it is.
- Add a "Forgot password?" link that uses `supabase.auth.resetPasswordForEmail` with redirect to a new public `/reset-password` page (required so a recovery link doesn't auto-log you in without changing the password).

### 4. New `/reset-password` page

- Public route, dark-theme styled, shows a "Set new password" form.
- Calls `supabase.auth.updateUser({ password })` then redirects to `/auth`.

### 5. Polish

- Header: hide the "Admin" nav link when not signed in (currently always visible).
- `/admin` page: small tweak so "Test connection" surfaces the Cults3D nickname it found, and "Save" toasts on success. No structural change.

## Sequencing (so you don't lock yourself out)

```text
1. Plan approved
2. You sign up at /auth          ← creates your admin row
3. You confirm: "I'm in"
4. I apply migration + UI changes ← locks signup, removes signup UI
5. You save Cults3D creds at /admin
```

If something goes wrong between steps 2 and 4, the trigger upgrade is reversible.

## Out of scope

- No multi-admin support, no invite flow, no 2FA. Single-owner studio.
- No change to how Cults3D credentials are stored — they remain service-role-only in `studio_settings` per the recent security hardening.
