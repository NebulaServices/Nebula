import express from "express";
import { createServer } from "node:http";
import path from "path";
import wisp from "wisp-server-node";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import { handler as ssrHandler } from "./dist/server/entry.mjs";
import multer from "multer";
import config from "./config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const publicPath = "dist/client";
const sequelize = new Sequelize("database", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  // SQLite only
  storage: "database.sqlite",
});

// Auth middleware
function auth_psk(req, res, next) {
  if (!config.marketplace_enabled) {
    let err = "Marketplace is disabled!";
    return next(err);
  }

  if (req.headers.psk !== config.marketplace_psk) {
    let err = "Bad PSK!";
    return next(err);
  }

  return next();
}

var image_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "database_assets/image");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //Appending extension
  },
});

var image_upload = multer({ storage: image_storage });

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
  author: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.TEXT,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  version: {
    type: DataTypes.TEXT,
  },
  background_image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  background_video: {
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

app.get("/api", function (request, reply) {
  reply.send({ hello: "world" });
});

// This API returns a list of the assets in the database (SW plugins and themes).
// It also returns the number of pages in the database.
// It can take a `?page=x` argument to display a different page, with a limit of 20 assets per page.
app.get("/api/catalog-assets", async (request, reply) => {
  try {
    const page = parseInt(request.query.page, 10) || 1; // default to page 1

    const totalItems = await catalog_assets.count();

    if (page < 1) {
      reply.status(400).send({ error: "Page must be a positive number!" });
      return;
    }

    const offset = (page - 1) * 20;

    const db_assets = await catalog_assets.findAll({
      offset: offset,
      limit: 20,
    });

    const assets = db_assets.reduce((acc, asset) => {
      acc[asset.package_name] = {
        title: asset.title,
        description: asset.description,
        author: asset.author,
        image: asset.image,
        tags: asset.tags,
        version: asset.version,
        background_image: asset.background_image,
        background_video: asset.background_video,
        payload: asset.payload,
        type: asset.type,
      };
      return acc;
    }, {});

    reply.send({ assets, pages: Math.ceil(totalItems / 20) });
  } catch (error) {
    reply.status(500).send({ error: "There was an error" });
  }
});

// This API returns data about a single package.
app.get("/api/packages/:package", async (request, reply) => {
  try {
    console.log(request.params.package);

    const package_row = await catalog_assets.findOne({
      where: { package_name: request.params.package },
    });

    if (!package_row) {
      return reply.status(404).send({ error: "Package not found!" });
    }

    const details = {
      title: package_row.get("title"),
      description: package_row.get("description"),
      image: package_row.get("image"),
      author: package_row.get("author"),
      tags: package_row.get("tags"),
      version: package_row.get("version"),
      background_image: package_row.get("background_image"),
      background_video: package_row.get("background_video"),
      payload: package_row.get("payload"),
      type: package_row.get("type"),
    };
    reply.send(details);
  } catch (error) {
    reply.status(500).send({ error: "There was an error" });
  }
});

// This API is responsible for image uploads
// PSK authentication required.
app.post(
  "/api/upload-image",
  auth_psk,
  image_upload.single("file"),
  (req, res) => {
    console.log("Request file:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(req.file.originalname);
    res.json({
      message: "File uploaded successfully",
      filename: req.file.originalname,
    });
  }
);

app.use("/images/", express.static("./database_assets/image"));
app.use("/videos/", express.static("./database_assets/video"));
app.use("/styles/", express.static("./database_assets/styles"));
app.use("/scripts/", express.static("./database_assets/scripts"));
app.use(ssrHandler);
app.use(express.static(publicPath));

// await catalog_assets.create({
//   package_name: "com.nebula.cybermonay",
//   title: "Cyber Monay",
//   image: "cyber_monay.jpg",
//   author: "Nebula Services",
//   version: "1.0.0",
//   description: 'A parody of the famous "Cyber Monay" hack!',
//   tags: ["Hacking", "Animated", "Funny"],
//   payload: "com.nebula.cybermonay.css",
//   background_video: "cyber_monay_test.mp4",
//   type: "theme",
// });

// await catalog_assets.create({
//   package_name: "com.neptune.neptune",
//   title: "Neptune",
//   image: "neptune.webp",
//   author: "Neptune",
//   version: "1.0.0",
//   description: "Neptune image",
//   tags: ["Image", "Funny"],
//   payload: "neptune.css",
//   background_image: "neptune.webp",
//   type: "theme",
// });

catalog_assets.sync();
const server = createServer();

server.on("request", (req, res) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  }
});

server.listen({
  port: 8080,
});
