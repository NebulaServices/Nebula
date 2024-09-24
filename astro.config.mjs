import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import aeroPath from "aero-proxy";
import aeroSandboxPath from "aero-sandbox/path";

export default defineConfig({
  integrations: [tailwind(), icon(), svelte()],
  vite: {
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: `${uvPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'uv',
                    overwrite: false
                },
                {
                    src: `${aeroPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'aero',
                    overwrite: false
                },
                {
                  src: `${aeroSandboxPath}/**/*`.replace(/\\/g, '/'),
                  dest: 'aero/sandbox',
                  overwrite: false
                },
                {
                    src: `${epoxyPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'epoxy',
                    overwrite: false 
                },
                {
                    src: `${baremuxPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'baremux',
                    overwrite: false
                }
            ]
        })
    ],
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
        "/videos": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
        "/wisp/" : {
            target: "ws://localhost:8080/wisp/",
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(/^\/wisp\//, '')
        },
        "/styles": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
        "/api/packages": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
        "/api/catalog-pages": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  },
  output: "server",
  adapter: node({
    mode: "hybrid",
  }),
});
