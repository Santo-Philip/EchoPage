// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
export default defineConfig({
  output: "server",

  vite: {
    build: {
      minify: false,
    },
    ssr: {
      external: [
        "child_process",
        "fs",
        "os",
        "node:crypto",
        "node:path",
        "node:url",
        "node:fs/promises",
      ],
    },
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
      configPath: "wrangler.toml",
    },
  }),
});
