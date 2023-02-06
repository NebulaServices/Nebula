import express from "express";
import cookieParser from "cookie-parser";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import path from "node:path";
import config from "./deployment.config.json" assert { type: "json" };

const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");

// Static files
app.use(cookieParser());

app.patch("/generate-otp", (req, res) => {

});

app.post("/validate-otp", (req, res) => {
  
});

app.all("/", (req, res, next) => {
  console.log(req.url);
  // validate verification
  if (
    config.sendgrid_verification == true ||
    config.discord_verification == true ||
    config.smtp_verificaton == true
  ) {
    if (!req.cookies["verification"]) {
      res.redirect("/unv.html");
    } else {
      next();
    }
  }
});
app.use("/uv/", express.static(uvPath));
app.use(express.static(path.join(__dirname, "static")));

// Bare Server
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Server running at http://localhost:${PORT}/.`);
});

server.listen({
  port: PORT
});
