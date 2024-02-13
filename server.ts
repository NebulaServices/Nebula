import { createBareServer } from "@nebula-services/bare-server-node";
import chalk from "chalk";
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "url";
import compression from "compression";
import createRammerhead from "rammerhead/src/server/index.js";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import wisp from "wisp-server-node";
import { Socket } from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LICENSE_SERVER_URL = "https://license.mercurywork.shop/validate?license=";
const whiteListedDomains = ["nebulaproxy.io"]; // Add any public domains you have here
const failureFile = fs.readFileSync("Checkfailed.html", "utf8");
const rh = createRammerhead();
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
  "/api/shuffleDict"
];
const rammerheadSession = /^\/[a-z0-9]{32}/;

console.log(`${chalk.magentaBright("Starting Nebula...")}\n`);

const app = express();
app.use(
  compression({
    threshold: 0,
    filter: () => true
  })
);
app.use(cookieParser());

// Congratulations! Masqr failed to validate, this is either your first visit or you're a FRAUD
async function MasqFail(req, res) {
  if (!req.headers.host) {
    // no bitch still using HTTP/1.0 go away
    return;
  }
  const unsafeSuffix = req.headers.host + ".html";
  let safeSuffix = path
    .normalize(unsafeSuffix)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  let safeJoin = path.join(process.cwd() + "/Masqrd", safeSuffix);
  try {
    await fs.promises.access(safeJoin); // man do I wish this was an if-then instead of a "exception on fail"
    const failureFileLocal = await fs.promises.readFile(safeJoin, "utf8");
    res.setHeader("Content-Type", "text/html");
    res.send(failureFileLocal);
    return;
  } catch (e) {
    res.setHeader("Content-Type", "text/html");
    res.send(failureFile);
    return;
  }
}

// Woooooo masqr yayyyy (said no one)
// uncomment for masqr
/* app.use(async (req, res, next) => {
    if (req.headers.host && whiteListedDomains.includes(req.headers.host)) {
            next();
            return;
    }
    if (req.url.includes("/bare/")) { // replace this with your bare endpoint
        next();
        return;
        // Bypass for UV and other bares
    }

    const authheader = req.headers.authorization;
    
    if (req.cookies["authcheck"]) {
        next();
        return;
    }


    if (req.cookies['refreshcheck'] != "true") {
        res.cookie("refreshcheck",  "true",  {maxAge: 10000}) // 10s refresh check
        MasqFail(req, res) 
        return;
    }
    
    if (!authheader) {
        
        res.setHeader('WWW-Authenticate', 'Basic'); // Yeah so we need to do this to get the auth params, kinda annoying and just showing a login prompt gives it away so its behind a 10s refresh check
        res.status(401);
        MasqFail(req, res) 
        return;
    }

    const auth = Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    const licenseCheck = ((await (await fetch(LICENSE_SERVER_URL + pass + "&host=" + req.headers.host)).json()))["status"]
    console.log(LICENSE_SERVER_URL + pass + "&host=" + req.headers.host +" returned " +licenseCheck)
    if (licenseCheck == "License valid") {
        res.cookie("authcheck", "true", {expires: new Date((Date.now()) + (365*24*60*60 * 1000))}) // authorize session, for like a year, by then the link will be expired lol
        res.send(`<script> window.location.href = window.location.href </script>`) // fun hack to make the browser refresh and remove the auth params from the URL
        return;
    }
    
    MasqFail(req, res)
    return; 
}) */

app.use(express.static("dist"));

app.get("/search=:query", async (req, res) => {
  const { query } = req.params;

  const response = await fetch(
    `http://api.duckduckgo.com/ac?q=${query}&format=json`
  ).then((apiRes) => apiRes.json());

  res.send(response);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = createServer();

const bare = createBareServer("/bare/");

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else if (shouldRouteRh(req)) {
    routeRhRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else if (shouldRouteRh(req)) {
    routeRhUpgrade(req, socket, head);
  } else {
    wisp.routeRequest(req, socket as Socket, head);
  }
});

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

const port = parseInt(process.env.PORT || "8080");

server.listen(port, () => {
  console.log(
    `${
      chalk.magentaBright("You can now use Nebula on port ") + chalk.bold(port)
    }\n`
  );
});
