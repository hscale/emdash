import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

export default defineConfig({
	site: "https://isobpms.com",
	output: "server",
	adapter: node({ mode: "standalone" }),
	security: {
		checkOrigin: false, // EmDash has its own CSRF (X-EmDash-Request header check)
	},
	i18n: {
		defaultLocale: "en",
		locales: ["en", "vi", "ja", "zh", "ko", "fr"],
		routing: { prefixDefaultLocale: false },
		fallback: { vi: "en", ja: "en", zh: "en", ko: "en", fr: "en" },
	},
	image: { layout: "constrained", responsiveStyles: true },
	integrations: [
		react(),
		emdash({
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	devToolbar: { enabled: false },
});
