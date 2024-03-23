import fp from "fastify-plugin";
import fs from "fs";
const failureFile = fs.readFileSync("Checkfailed.html", "utf8");
const LICENSE_SERVER_URL = "https://license.mercurywork.shop/validate?license=";
const whiteListedDomain = ["nebulaproxy.io"];
async function licenseCheck(req, pass) {
  try {
    const resp = await fetch(
      `${LICENSE_SERVER_URL}${pass}&host=${req.headers.host}`
    );
    const data = await resp.json();
    if (data.status === "License valid") {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
const plugin = (fastify, opts, done) => {
  fastify.addHook("onRequest", function (req, reply, next) {
    if (
      req.cookies.authcheck === "true" ||
      whiteListedDomain.includes(req.headers.host)
    ) {
      return next();
    }
    const authHeader = req.headers.authorization;
    if (req.cookies.refreshcheck != "true") {
      reply
        .setCookie("refreshcheck", "true", { maxAge: 1000 })
        .type("text/html")
        .send(failureFile);
      return;
    }
    if (!authHeader) {
      reply
        .code(401)
        .header("WWW-Authenticate", "Basic")
        .type("text/html")
        .send(failureFile);
      return;
    }
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const user = auth[0];
    const pass = auth[1];
    licenseCheck(req, pass).then((data) => {
      if (!data) {
        reply
          .status(401)
          .header("WWW-Authenticate", "Basic")
          .type("text/html")
          .send(failureFile);
        return;
      } else {
        reply
          .setCookie("authcheck", "true")
          .type("text/html")
          .send("<script>window.location.href = window.location.href</script>");
        return;
      }
    });
  });
  done();
};

const masqr = fp(plugin, {
  fastify: "4.x",
  name: "masqr"
});

export default masqr;
