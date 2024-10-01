import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';

export default defineConfig({
  integrations: [tailwind(), icon(), svelte()],
  vite: {
    build: {
        rollupOptions: {
            external: ['@mercuryworkshop/epoxy-tls-new']
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: `${uvPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'uv',
                    overwrite: false
                },
                {
                    src: `${epoxyPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'epoxy',
                    overwrite: false 
                },
                {
                    src: `${libcurlPath}/**/*`.replace(/\\/g, '/'),
                    dest: 'libcurl',
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
