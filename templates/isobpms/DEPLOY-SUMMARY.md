# ISO BPMS Marketing Website — Deploy Summary

## W5H

| Question | Answer |
|----------|--------|
| **What** | Built and deployed isobpms.com marketing website using EmDash CMS on Astro |
| **Why** | ISO BPMS needed a public marketing site with CMS-managed content, multilingual support, and proper admin editing UX |
| **Who** | AIKU Viet (developer), deployed to Hetzner ARM64 server 135.181.46.209 |
| **When** | 2026-04-03 to 2026-04-04 |
| **Where** | Production: https://isobpms.com, Admin: https://isobpms.com/_emdash/admin |
| **How** | EmDash CMS (Astro SSR) + Node.js standalone adapter + SQLite + nginx reverse proxy + Cloudflare SSL |

## Steps Completed

1. Created EmDash site template (`templates/isobpms/`) with 7 custom block components (Hero, AiCore, Features, Modules, Testimonials, Pricing, FAQ)
2. Designed seed schema with brand colors (Navy #132f5e, Green #7bc03b) and ISO BPMS brand assets
3. Added 6-language i18n support (EN/VI/JA/ZH/KO/FR) with locale routing, language switcher, and translated UI strings
4. Deployed to server 209 as systemd service (`isobpms-website`) on port 4000, proxied by nginx
5. Fixed passkey auth — `getPasskeyConfig()` now reads `X-Forwarded-Host`/`X-Forwarded-Proto` headers for reverse proxy compatibility
6. Fixed auth redirects — changed `new URL(..., url.origin)` to relative paths to prevent `http://localhost:4000` redirects
7. Fixed Astro CSRF — disabled `security.checkOrigin` (EmDash has its own X-EmDash-Request CSRF protection)
8. Added `X-Forwarded-Host` to nginx config for isobpms.com
9. Fixed InlinePortableTextEditor — added `pluginBlock` TipTap node for custom block types, fixed field data detection and _key roundtrip
10. Restructured from Portable Text custom blocks to separate CMS collections for proper admin editing UX:
    - `pages` (3) — hero fields per page
    - `ai_capabilities` (6) — AI feature cards
    - `platform_features` (6) — platform feature cards
    - `modules` (9) — business module cards
    - `testimonials` (3) — customer quotes
    - `faq_items` (8) — FAQ entries (5 home + 3 pricing)
    - `pricing_plans` (3) — pricing tiers

## Server Layout

```
/opt/apps/isobpms-website/
  dist/              Astro build output (server + client)
  data.db            SQLite database
  seed/seed.json     Schema + content seed
  public/            Static assets (favicon)
  uploads/           Media uploads
  node_modules/      Runtime deps (react, better-sqlite3, kysely)
```

- Service: `systemctl status isobpms-website`
- Nginx: `/etc/nginx/sites-available/isobpms.com`
- Port: 4000 (HOST=127.0.0.1)
