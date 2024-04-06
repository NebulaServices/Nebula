import million from "million/compiler";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { dynamicPath } from "@nebula-services/dynamic";
//@ts-ignore
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
//@ts-ignore
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import path from "path";
import { createBareServer } from "@tomphttp/bare-server-node";
import wisp from "wisp-server-node";
import http from "http";
const __dirname = path.resolve();

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `${uvPath}/**/*`.replace(/\\/g, "/"),
          dest: "uv",
          overwrite: false
        },
        {
          src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
          dest: "epoxy",
          overwrite: false
        },
        {
          src: `${libcurlPath}/**/*`.replace(/\\/g, "/"),
          dest: "libcurl",
          overwrite: false
        },
        {
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
      "/bare/": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare\//, "")
      },
      "/wisp/": {
        target: "http://ruby.rubynetwork.co/wisp/",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/wisp\//, "")
      }
    }
  }
});
