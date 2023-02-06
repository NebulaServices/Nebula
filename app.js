import createBareServer from "@tomphttp/bare-server-node";
import http from "http";
import { createRequire } from "module";
import { dirname, join } from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const config = require("./deployment.config.json");
import fs from "fs";
var base64data;
import sgTransport from "nodemailer-sendgrid-transport";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
const options = {
  auth: {
    api_key: config.sendgrid_options.api_key
  }
};
const sendgridMailerAgent = nodemailer.createTransport(sgTransport(options));
const smtpMailerAgent = nodemailer.createTransport(config.smtp_options);
function sendVerificationEmail(UUID, OTP) {
  let email = {
    to: "",
    from: "",
    subject: `NebulaWEB personal access code ${OTP}`,
    text: `
 ####### ACCESS CODE (OTP) ${OTP} #######
 ####### DO NOT SHARE THIS CODE!  ####### 
  (this message is automated)`,
    html: `
    ####### ACCESS CODE (OTP) ${OTP} #######
 ####### DO NOT SHARE THIS CODE!  ####### 
  (this message is automated)
  `
  };
  if (config.sendgrid_verification == true) {
    email.to = config.sendgrid_options.to_email;
    email.from = config.sendgrid_options.sendFromEmail;
    sendgridMailerAgent.sendMail(email, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
    });
  }
  if (config.smtp_verification == true) {
    email.to = config.smtp_options.to_email;
    email.from = config.smtp_options.sendFromEmail;
    smtpMailerAgent.sendMail(email, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
    });
  }
  if (config.discord_verification == true) {
    fetch(config.webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: `Your NebulaWEB access code is ${OTP}`
      })
    });
  }
}

function getNewCode() {
  var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  if (seq == "0") {
    getNewCode();
  }
  return seq;
}

const PORT = process.env.PORT || 3000;
const bareServer = createBareServer("/bare/", {
  logErrors: false,
  localAddress: undefined
});

const serve = serveStatic(
  join(dirname(fileURLToPath(import.meta.url)), "static/"),
  {
    fallthrough: false,
    maxAge: 5 * 60 * 1000
  }
);

const server = http.createServer();

server.on("request", (request, response) => {
  try {
    if (bareServer.shouldRoute(request)) {
      bareServer.routeRequest(request, response);
    } else {
      let base64data;
      const url = request.url;
      if (url.startsWith("/sendNewCode")) {
        const OTP = getNewCode();
        fs.writeFile("./memory.txt", OTP, function (err) {
          if (err) return console.log(err);
          console.log(`Wrote OTP code to temp file`);
        });

        fs.readFile("./memory.txt", "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(data);

          sendVerificationEmail("10", data);
          let buff = new Buffer(data);
          base64data = buff.toString("base64");
          console.log("302");
          response.writeHead(302, {
            location: "/unv.html?c=" + base64data
          });
          response.end();
        });
      } else if (url.startsWith("/verification")) {
        var body;
        if (
          config.sendgrid_verification == true ||
          config.discord_verification == true ||
          config.smtp_verificaton == true
        ) {
          const body = "true";
          response.writeHead(200, {
            "Content-Length": Buffer.byteLength(body),
            "Content-Type": "text/plain"
          });
          response.end(body);
        } else {
          const body = "false";
          response.writeHead(200, {
            "Content-Length": Buffer.byteLength(body),
            "Content-Type": "text/plain"
          });
          response.end(body);
        }
      } else {
        serve(request, response, (err) => {
          response.writeHead(err?.statusCode || 500, null, {
            "Content-Type": "text/plain"
          });
          response.end(err?.stack);
        });
      }
    }
  } catch (e) {
    response.writeHead(500, "Internal Server Error", {
      "Content-Type": "text/plain"
    });
    response.end(e.stack);
  }
});
server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT);

if (process.env.UNSAFE_CONTINUE)
  process.on("uncaughtException", (err, origin) => {
    console.error(`Critical error (${origin}):`);
    console.error(err);
    console.error("UNSAFELY CONTINUING EXECUTION");
    console.error();
  });

console.log(`Server running at http://localhost:${PORT}/.`);
