# Changelog

## 2026-04-04

### Added
- ISO BPMS marketing website template (`templates/isobpms/`)
- 7 Astro block components: Hero, AiCore, Features, Modules, Testimonials, Pricing, FAQ
- 6-language support (EN/VI/JA/ZH/KO/FR) with i18n routing and language switcher
- 7 CMS collections for admin-editable content
- Seed file with 38 content entries across all collections
- Brand integration: Navy/Green colors, process-flow logo SVG, favicon

### Fixed (EmDash core)
- `passkey-config.ts`: Read `X-Forwarded-Host`/`X-Forwarded-Proto` for reverse proxy WebAuthn
- `auth.ts`: Use relative redirect paths instead of `url.origin` (prevents localhost redirects)
- `InlinePortableTextEditor.tsx`: Added pluginBlock TipTap node for custom block types, fixed field data detection and _key roundtrip preservation
- `PortableText.astro`: Skip inline editor when all blocks are custom types (prevents content corruption)

### Deployed
- Production: https://isobpms.com (server 135.181.46.209, port 4000)
- Admin: https://isobpms.com/_emdash/admin
