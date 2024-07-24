import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = fastify({ logger: false });

await app.register(import("@fastify/compress"));

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
  serve: true,
  wildcard: false,
});

app.listen({
  port: 8080,
  host: "0.0.0.0",
});
