import express from "express";
import cookieParser from "cookie-parser";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import path from "node:path";
import config from "./deployment.config.json" assert { type: "json" };
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import * as uuid from "uuid";
import fs from "node:fs";
import bcrypt from "bcrypt";
// fx
const PORT = process.env.PORT || 3000;
const __dirname = process.cwd();
const ACTIVE_CODES = new Set();
if (!fs.existsSync("./tmp/memory.txt")) {
  fs.writeFileSync("./tmp/memory.txt", "", "utf-8");
}
let TOKENS = fs
  .readFileSync("./tmp/memory.txt", "utf-8")
  .trim()
  .split("\n")
  .map((token) => {
    const parts = token.split(":");
    return {
      id: parts[0],
      token: parts[1],
      expiration: parts[2]
    };
  });

const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// Verification
app.patch("/generate-otp", async (req, res) => {
  if (
    config.sendgrid_verification ||
    config.discord_verification ||
    config.smtp_verificaton
  ) {
    const OTP = generateCode();
    ACTIVE_CODES.add(OTP);

    setTimeout(() => {
      ACTIVE_CODES.delete(OTP);
    }, 1000 * 60 * 5);

    let email = {
      to: "",
      from: "",
      subject: `NebulaWEB personal access code ${OTP}`,
      text: `
 ####### ACCESS CODE (OTP) ${OTP} #######
 ####### DO NOT SHARE THIS CODE!  ####### 
  (this message is automated)`
    };

    if (config.sendgrid_verification) {
      sgMail.setApiKey(config.sendgrid_options.api_key);

      email.to = config.sendgrid_options.to_email;
      email.from = config.sendgrid_options.sendFromEmail;
      try {
        await sgMail.send(msg);
      } catch {
        return res.status(504).end();
      }
    }

    if (config.smtp_verification) {
      const smtpMailerAgent = nodemailer.createTransport(config.smtp_options);

      email.to = config.smtp_options.to_email;
      email.from = config.smtp_options.sendFromEmail;
      try {
        smtpMailerAgent.sendMail(email);
      } catch {
        return res.status(504).end();
      }
    }

    if (config.discord_verification) {
      try {
        await fetch(config.webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: `Your NebulaWEB access code is \`${OTP}\``
          })
        });
      } catch {
        return res.status(500).end();
      }
    }

    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

function generateCode() {
  const code = Math.floor(Math.random() * 1000000);
  return code.toString().padStart(6, "0");
}

app.post("/validate-otp", (req, res) => {
  if (
    config.sendgrid_verification ||
    config.discord_verification ||
    config.smtp_verificaton
  ) {
    const OTP = req.body.otp;

    if (ACTIVE_CODES.has(OTP)) {
      ACTIVE_CODES.delete(OTP);

      const token = uuid.v4();

      TOKENS.push({
        id: OTP,
        token: hash(token),
        expiration: Date.now() + 1000 * 60 * 60 * 24 * 30
      });

      fs.writeFileSync(
        "./tmp/memory.txt",
        TOKENS.map((token) => {
          return `${token.id}:${token.token}:${token.expiration}`;
        }).join("\n"),
        "utf-8"
      );

      res.status(200).json({
        success: true,
        validation: `${OTP}:${token}`
      });
    } else {
      res.status(401).json({
        success: false
      });
    }
  } else {
    res.status(404).end();
  }
});

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uv/", express.static(uvPath));

// Login route
app.get("/login", (req, res) => {
  if (
    config.sendgrid_verification ||
    config.discord_verification ||
    config.smtp_verificaton
  ) {
    res.sendFile(path.join(__dirname, "src", "unv.html"));
  } else {
    res.redirect("/");
  }
});

// General Routes
app.use((req, res, next) => {
  if (
    config.sendgrid_verification ||
    config.discord_verification ||
    config.smtp_verificaton
  ) {
    const verification = req.cookies["validation"];
    if (!verification || !validateToken(verification)) {
      return res.redirect("/login");
    }
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/options", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "options.html"));
});

app.get("/privacy", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "privacy.html"));
});

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

function hash(token) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(token, salt);
}

function validateToken(verification) {
  const [id, token] = verification.split(":");
  const tokenData = TOKENS.find((token) => token.id == id);

  if (!tokenData) {
    return false;
  }

  if (tokenData.expiration < Date.now()) {
    return false;
  }

  return bcrypt.compareSync(token, tokenData.token);
}
