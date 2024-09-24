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
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
//@ts-ignore
import { bareModulePath } from "@mercuryworkshop/bare-as-module3"
import path from "path";
import { createBareServer } from "@tomphttp/bare-server-node";
import wisp from "wisp-server-node";
import http from "http";
import vsharp from "vite-plugin-vsharp";

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
          src: `${baremuxPath}/**/*`.replace(/\\/g, "/"),
          dest: "baremux",
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
          src: `${bareModulePath}/**/*`.replace(/\\/g, "/"),
          dest: "baremod",
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
    preact(),
    vsharp({
      width: 400
    })
  ],
  server: {
    proxy: {
      "/bare/": {
        target: "http://localhost:8080/bare/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bare\//, "")
      },
      "/wisp/": {
        target: "http://localhost:8080/wisp/",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/wisp\//, "")
      },
      "/search": {
        target: "http://localhost:8080/search",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/search/, "")
      }
    }
  }
});
