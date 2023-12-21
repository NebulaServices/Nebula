import million from "million/compiler";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // .replace fixes weird paths on Windows
          src: `${uvPath}/uv.*.js`.replace(/\\/g, "/"),
          dest: "uv",
          overwrite: false
        }
      ]
    }),
    million.vite({ auto: true }),
    preact()
  ],
  server: {
    proxy: {
      "/bare": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare/, "")
      }
    }
  }
});
