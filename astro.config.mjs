// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
export default defineConfig({
  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: cloudflare({
      platformProxy: {
    enabled: true,
    configPath: 'wrangler.toml'
  }
  }
  ),
});
