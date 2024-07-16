import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "@fastify/cookie";
import { createServer } from "http";
import { createBareServer } from "@tomphttp/bare-server-node";
import createRammerhead from "rammerhead/src/server/index.js";
import wisp from "wisp-server-node";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bare = createBareServer("/bare/");
const rh = createRammerhead();
import chalk from "chalk";
import masqr from "./masqr.js";

const rammerheadScopes = [
  "/rammerhead.js",
  "/hammerhead.js",
  "/transport-worker.js",
  "/task.js",
  "/iframe-task.js",
  "/worker-hammerhead.js",
  "/messaging",
  "/sessionexists",
  "/deletesession",
  "/newsession",
  "/editsession",
  "/needpassword",
  "/syncLocalStorage",
  "/api/shuffleDict",
  "/mainport"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

function shouldRouteRh(req) {
  const url = new URL(req.url, "http://0.0.0.0");
  return (
    rammerheadScopes.includes(url.pathname) ||
    rammerheadSession.test(url.pathname)
  );
}

function routeRhRequest(req, res) {
  rh.emit("request", req, res);
}

function routeRhUpgrade(req, socket, head) {
  rh.emit("upgrade", req, socket, head);
}
const port = parseInt(process.env.PORT) || 8080;
const serverFactory = (handler, opts) => {
  return createServer()
    .on("request", (req, res) => {
      if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
      } else if (shouldRouteRh(req)) {
        routeRhRequest(req, res);
      } else {
        handler(req, res);
      }
    })
    .on("upgrade", (req, socket, head) => {
      if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
      } else if (shouldRouteRh(req)) {
        routeRhUpgrade(req, socket, head);
      } else if (req.url.endsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
      }
    });
};

const app = fastify({ logger: false, serverFactory });

app.register(cookieParser);
await app.register(import("@fastify/compress"));
//Uncomment the following line to enable masqr
//app.register(masqr);

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
  serve: true,
  wildcard: false
});

app.get("/search=:query", async (req, res) => {
  const { query } = req.params as { query: string }; // Define the type for req.params

  const response = await fetch(
    `http://api.duckduckgo.com/ac?q=${query}&format=json`
  ).then((apiRes) => apiRes.json());

  res.send(response);
});

app.setNotFoundHandler((req, res) => {
  res.sendFile("index.html"); // SPA catch-all
});

console.log(
  chalk.green(`Server listening on ${chalk.bold(`http://localhost:${port}`)}`)
);
console.log(
  chalk.magenta(
    `Server also listening on ${chalk.bold(`http://0.0.0.0:${port}`)}`
  )
);

app.listen({
  port: port,
  host: "0.0.0.0"
});
