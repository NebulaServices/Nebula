import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), svelte()],
  vite: {
    server: {
      proxy: {
        "/api/catalog-assets": {
          target: "http://localhost:8080/api/catalog-assets",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/catalog-assets/, ""),
        },
        "/images": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  },
});
