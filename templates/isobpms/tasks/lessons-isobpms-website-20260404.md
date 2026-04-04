# Lessons Learned — ISO BPMS Website

## 1. Reverse proxy breaks WebAuthn passkeys
**Problem:** `getPasskeyConfig()` used `request.url` which resolves to `localhost:4000` behind nginx. WebAuthn RP ID must match the public domain.
**Fix:** Read `X-Forwarded-Host` and `X-Forwarded-Proto` headers. Also add `proxy_set_header X-Forwarded-Host $host` to nginx config.
**Rule:** Always pass `request` object to functions that generate URLs for browser APIs (WebAuthn, OAuth redirects).

## 2. Astro `url.origin` is localhost behind proxy
**Problem:** `new URL("/_emdash/admin/login", url.origin)` produces `http://localhost:4000/...` redirect that browsers can't follow.
**Fix:** Use relative redirect paths (`"/_emdash/admin/login?redirect=..."`) instead of absolute URLs.
**Rule:** Never use `url.origin` for redirects in server-rendered apps behind reverse proxies.

## 3. Astro's `security.checkOrigin` blocks proxied POST requests
**Problem:** Astro compares `Origin: https://isobpms.com` against `request.url` host `localhost:4000` → "Cross-site POST form submissions are forbidden".
**Fix:** Set `security: { checkOrigin: false }` when the app has its own CSRF protection.

## 4. EmDash inline editor corrupts custom Portable Text blocks
**Problem:** The InlinePortableTextEditor converts unknown block types to `[blockType]` text, then auto-saves this back to the database, destroying the original content.
**Fix:** Added `pluginBlock` TipTap node extension + field data detection + _key preservation for lossless roundtrip.
**Better fix:** Don't use custom PT blocks for marketing content — use separate CMS collections with simple fields instead.

## 5. Custom PT blocks = bad admin UX
**Problem:** Storing marketing content as custom Portable Text blocks (bpms.hero, bpms.aiCore) makes it uneditable in both the inline editor and the admin panel.
**Fix:** Restructured to separate collections (ai_capabilities, modules, testimonials, etc.) with simple string/text/integer fields. Non-tech users can now click → edit → save.
**Rule:** For structured, repeatable content (feature cards, FAQ items, pricing plans), use separate CMS collections — not custom PT block types.

## 6. Astro filesystem sessions don't persist across deploys
**Problem:** Sessions are stored in the filesystem. Redeploying (rm -rf dist/) doesn't clear sessions, but resetting the database does.
**Workaround:** Created magic link tokens directly in the database for automated admin access.

## 7. EmDash `emdash:site_url` must be set for production
**Problem:** Default site URL is `http://localhost:4000`. This breaks passkey RP name display and email links.
**Fix:** Set via `sqlite3 data.db "UPDATE options SET value = '\"https://isobpms.com\"' WHERE name = 'emdash:site_url';"` after seeding.

## 8. Root tsconfig.json conflicts in monorepo
**Problem:** The isobpms template's tsconfig (`extends: astro/tsconfigs/strict`) accidentally overwrote the workspace root tsconfig, breaking the core package build.
**Fix:** `git checkout tsconfig.json` to restore. Templates should never modify workspace-level config files.
