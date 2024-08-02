import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = fastify({ logger: false });
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

const catalog_assets = sequelize.define("catalog_assets", {
  package_name: {
    type: DataTypes.TEXT,
    unique: true,
  },
  title: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.JSON,
  },
  image: {
    type: DataTypes.TEXT,
  },
  script: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.TEXT,
  },
});

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
