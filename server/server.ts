import { fileURLToPath } from "node:url";
import fastifyCompress from "@fastify/compress";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import chalk from 'chalk';
import { serverFactory } from "./serverFactory.js";
import { handler as ssrHandler } from "../dist/server/entry.mjs";
import gradient from "gradient-string";
import { parsedDoc } from "./config.js";
import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { setupDB } from "./dbSetup.js";


const app = Fastify({ logger: parsedDoc.server.server.logging, ignoreDuplicateSlashes: true, ignoreTrailingSlash: true, serverFactory: serverFactory });
const db = new Sequelize(parsedDoc.db.name, parsedDoc.db.username, parsedDoc.db.password, {
    host: parsedDoc.db.postgres ? `${parsedDoc.postgres.domain}` : 'localhost',
    port: parsedDoc.db.postgres ? parsedDoc.postgres.port : undefined,
    dialect: parsedDoc.db.postgres ? 'postgres': 'sqlite',
    logging: parsedDoc.server.server.logging,
    storage: 'database.sqlite' //this is sqlite only
});

type CatalogType = "theme" | "plugin"

interface Catalog {
    package_name: string
    title: string
    description: string
    author: string
    image: string
    tags: object
    version: string
    background_image: string
    background_video: string 
    payload: string
    type: CatalogType
}

interface CatalogModel extends Catalog, Model<InferAttributes<CatalogModel>, InferCreationAttributes<CatalogModel>> {};

const catalogAssets = db.define<CatalogModel>("catalog_assets", {
    package_name: { type: DataTypes.TEXT, unique: true },
    title: { type: DataTypes.TEXT },
    description: { type: DataTypes.TEXT },
    author: { type: DataTypes.TEXT },
    image: { type: DataTypes.TEXT },
    tags: { type: DataTypes.JSON, allowNull: true },
    version: { type: DataTypes.TEXT },
    background_image: { type: DataTypes.TEXT, allowNull: true },
    background_video: { type: DataTypes.TEXT, allowNull: true },
    payload: { type: DataTypes.TEXT },
    type: { type: DataTypes.TEXT }
});

await app.register(fastifyCompress, {
    encodings: ['br', 'gzip', 'deflate']
});

await app.register(fastifyMultipart);

await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../dist/client', import.meta.url)),
    decorateReply: false,
});

await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../database_assets/image', import.meta.url)),
    prefix: '/images/',
    decorateReply: false
});
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../database_assets/video', import.meta.url)),
    prefix: '/videos/',
    decorateReply: false 
});
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../database_assets/styles', import.meta.url)),
    prefix: '/styles/',
    decorateReply: false 
});
await app.register(fastifyStatic, {
    root: fileURLToPath(new URL('../database_assets/scripts', import.meta.url)),
    prefix: '/scripts/',
    decorateReply: false 
});

await app.register(fastifyMiddie);

app.get("/api", (request, reply) => {
    reply.send({ Server: 'Active' });
});

// This API returns a list of the assets in the database (SW plugins and themes).
// It also returns the number of pages in the database.
// It can take a `?page=x` argument to display a different page, with a limit of 20 assets per page.
type CatalogAssetsReq = FastifyRequest<{Querystring: { page: string } }>
app.get("/api/catalog-assets/", async (request: CatalogAssetsReq, reply) => {
    try {
        const { page } = request.query;
        const pageNum: number = parseInt(page, 10) || 1;
        if (pageNum < 1) {
            reply.status(400).send({ error: "Page must be a positive number!" });
        }
        const offset = (pageNum - 1) * 20;
        const totalItems = await catalogAssets.count();
        const dbAssets = await catalogAssets.findAll({ offset: offset, limit: 20 });
        const assets = dbAssets.reduce((acc, asset) => {
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
                type: asset.type
            };
            return acc;
        }, {});
        reply.send({ assets, pages: Math.ceil(totalItems / 20) });
    }
    catch (error) {
        reply.status(500).send({ error: 'An error occured' });
    }
});


type PackageReq = FastifyRequest<{Params: { package: string } }>
app.get("/api/packages/:package", async (request: PackageReq, reply) => {
    try {
        const packageRow = await catalogAssets.findOne({ where: { package_name: request.params.package }});
        if (!packageRow) return reply.status(404).send({ error: 'Package not found!' });
        const details = {
            title: packageRow.get("title"),
            description: packageRow.get('description'),
            image: packageRow.get('image'),
            author: packageRow.get('author'),
            tags: packageRow.get('tags'),
            version: packageRow.get('version'),
            background_image: packageRow.get('background_image'),
            background_video: packageRow.get('background_video'),
            payload: packageRow.get('payload'),
            type: packageRow.get('type')
        };
        reply.send(details);
    } 
    catch (error) {
        reply.status(500).send({ error: 'An unexpected error occured' });
    }
});

type UploadReq = FastifyRequest<{Headers: { psk: string }}>;
type CreateReq = FastifyRequest<{Headers: { psk: string}, Body: { uuid: string, title: string, image: string, author: string, version: string, description: string, tags: object | any, payload: string, background_video: string, background_image: string, type: string }}>;
async function verifyReq(request: UploadReq | CreateReq, reply: FastifyReply, upload: Boolean, data: any) {
    return new Promise<void>((resolve, reject) => {
        if (parsedDoc.marketplace.enabled === false) {
            reply.status(500).send({ error: 'Marketplace is disabled!' });
            reject();
        }
        else if (request.headers.psk !== parsedDoc.marketplace.psk) {
            reply.status(403).send({ error: 'PSK not correct!' });
            reject();
        }
        else if (upload && !data) {
            reply.status(400).send({ error: 'No file uploaded!' });
            reject();
        }
        else { resolve(); }
    });
}

app.post("/api/upload-image", async (request: UploadReq, reply) => {
    const data = await request.file();
    verifyReq(request, reply, true, data)
    .then(async () => {
        await pipeline(data.file, createWriteStream(fileURLToPath(new URL(`../database_assets/image/${data.filename}`, import.meta.url))));
        reply.send({ message: 'File uploaded successfully!', filename: data.filename });
    })
    .catch(() => { 
        if (parsedDoc.server.server.logging) { console.error(chalk.yellow.bold('Caught error from verify function. \n Error caused while uploading image')) };
    });
});
app.post("/api/upload-video", async (request: UploadReq, reply) => {
    const data = await request.file();
    verifyReq(request, reply, true, data)
    .then(async () => {
        await pipeline(data.file, createWriteStream(fileURLToPath(new URL(`../database_assets/video/${data.filename}`, import.meta.url))));
        reply.send({ message: 'File uploaded successfully!', filename: data.filename });
    })
    .catch(() => { 
        if (parsedDoc.server.server.logging) { console.error(chalk.yellow.bold('Caught error from verify function. \n Error caused while uploading video')) };
    });
});
app.post("/api/upload-style", async (request: UploadReq, reply) => {
    const data = await request.file();
    verifyReq(request, reply, true, data)
    .then(async () => {
        await pipeline(data.file, createWriteStream(fileURLToPath(new URL(`../database_assets/styles/${data.filename}`, import.meta.url))));
        reply.send({ message: 'File uploaded successfully!', filename: data.filename });
    })
    .catch(() => { 
        if (parsedDoc.server.server.logging) { console.error(chalk.yellow.bold('Caught error from verify function. \n Error caused while uploading style')) };
    });
});
app.post("/api/upload-script", async (request: UploadReq, reply) => {
    const data = await request.file();
    verifyReq(request, reply, true, data)
    .then(async () => {
        await pipeline(data.file, createWriteStream(fileURLToPath(new URL(`../database_assets/video/${data.filename}`, import.meta.url))));
        reply.send({ message: 'File uploaded successfully!', filename: data.filename });
    })
    .catch(() => { 
        if (parsedDoc.server.server.logging) { console.error(chalk.yellow.bold('Caught error from verify function. \n Error caused while uploading script')) };
    });
});

app.post("/api/create-package", async (request: CreateReq, reply) => {
    verifyReq(request, reply, false, undefined)
    .then(async () => {
       await catalogAssets.create({
            package_name: request.body.uuid,
            title: request.body.title,
            image: request.body.image,
            author: request.body.author,
            version: request.body.version,
            description: request.body.description,
            tags: request.body.tags,
            payload: request.body.payload,
            background_video: request.body.background_video,
            background_image: request.body.background_image,
            type: request.body.type as CatalogType
        });
    })
    .catch(async () => {
        if (parsedDoc.server.server.logging) { console.error(chalk.yellow.bold('Caught error from verify function. \n Error caused while creating package')) };
    });
});

app.use(ssrHandler);

const port: number = parseInt(process.env.PORT as string) || parsedDoc.server.server.port || parseInt('8080');
const titleText = ` 
 _   _      _           _         ____                  _               
| \\ | | ___| |__  _   _| | __ _  / ___|  ___ _ ____   _(_) ___ ___  ___ 
|  \\| |/ _ \\ '_ \\| | | | |/ _' | \\___ \\ / _ \\ '__\\ \\ / / |/ __/ _ \\/ __|
| |\\  |  __/ |_) | |_| | | (_| |  ___) |  __/ |   \\ V /| | (_|  __/\\__ \\
|_| \\_|\\___|_.__/ \\__,_|_|\\__,_| |____/ \\___|_|    \\_/ |_|\\___\\___||___/
`
const titleColors = {
    purple: "#7967dd",
    pink: "#eb6f92"
};


console.log(gradient(Object.values(titleColors)).multiline(titleText as string));
app.listen({ port: port, host: '0.0.0.0' }).then(async () => {
    console.log(chalk.hex('#7967dd')(`Server listening on ${chalk.hex('#eb6f92').bold('http://localhost:' + port + '/')}`));
    console.log(chalk.hex('#7967dd')(`Server also listening on ${chalk.hex('#eb6f92').bold('http://0.0.0.0:' + port + '/')}`));
    await catalogAssets.sync()
    await setupDB(catalogAssets);
});

export { CatalogModel, Catalog }
