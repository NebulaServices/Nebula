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
    allowNull: true,
  },
  version: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  video: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payload: {
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

app.get("/api", function (request, reply) {
  reply.send({ hello: "world" });
});

app.get("/api/catalog-assets", async (request, reply) => {
  try {
    // i've literally never done shit like this before so lets hope its not shit
    const assets = await catalog_assets.findAll();
    const response = assets.reduce((acc, asset) => {
      acc[asset.package_name] = {
        title: asset.title,
        description: asset.description,
        tags: asset.tags,
        version: asset.version,
        image: asset.image, // @todo: change this to a route. like "/images/" + asset.package_name and return the image there.
        video: asset.video, // same with video.
        payload: asset.payload,
        type: asset.type,
      };
      return acc;
    }, {});

    reply.send(response);
  } catch (error) {
    reply.status(500).send({ error: "there was an error" });
  }
});

await catalog_assets.create({
  package_name: "com.fortnite.jpeg",
  title: "fortnite.jpeg",
  version: "6.9.420",
  description: "a man in a blessings shirt sticking his tounge out",
  tags: ["Fortnite", "Shit out my ass"],
  payload: "the DAMN CSS",
  type: "theme",
});

catalog_assets.sync();

app.listen({
  port: 8080,
  host: "0.0.0.0",
});
