import million from "million/compiler";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@nebula-services/ultraviolet";
import { dynamicPath } from "@nebula-services/dynamic";
import path from "path";
const __dirname = path.resolve();

console.log(dynamicPath);

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // .replace fixes weird paths on Windows
          src: `${uvPath}/uv.*.js`.replace(/\\/g, "/"),
          dest: "uv",
          overwrite: false
        },
        {
          // .replace fixes weird paths on Windows
          src: `${dynamicPath}/dynamic.*.js`.replace(/\\/g, "/"),
          dest: "dynamic",
          overwrite: false
        },
        {
          src: `${__dirname}/node_modules/localforage/dist/localforage.*.js`.replace(
            /\\/g,
            "/"
          ),
          dest: "localforage",
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
