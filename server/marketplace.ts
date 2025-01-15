import { createWriteStream } from "node:fs";
import { constants, access, mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { FastifyInstance, FastifyRequest } from "fastify";
import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { parsedDoc } from "./config.js";

const db = new Sequelize(parsedDoc.db.name, parsedDoc.db.username, parsedDoc.db.password, {
    host: parsedDoc.db.postgres ? `${parsedDoc.postgres.domain}` : "localhost",
    port: parsedDoc.db.postgres ? parsedDoc.postgres.port : undefined,
    dialect: parsedDoc.db.postgres ? "postgres" : "sqlite",
    logging: parsedDoc.server.server.logging,
    storage: "database.sqlite" //this is sqlite only
});

type CatalogType = "theme" | "plugin-page" | "plugin-sw";

interface Catalog {
    package_name: string;
    title: string;
    description: string;
    author: string;
    image: string;
    tags: object;
    version: string;
    background_image: string;
    background_video: string;
    payload: string;
    type: CatalogType;
}

interface CatalogModel
    extends Catalog,
        Model<InferAttributes<CatalogModel>, InferCreationAttributes<CatalogModel>> {}

const catalogAssets = db.define<CatalogModel>("catalog_assets", {
    package_name: { type: DataTypes.STRING, unique: true },
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

function marketplaceAPI(app: FastifyInstance) {
    app.get("/api/catalog-stats/", (request, reply) => {
        reply.send({
            version: "1.0.0",
            spec: "Nebula Services",
            enabled: true
        });
    });

    // This API returns a list of the assets in the database (SW plugins and themes).
    // It also returns the number of pages in the database.
    // It can take a `?page=x` argument to display a different page, with a limit of 20 assets per page.
    type CatalogAssetsReq = FastifyRequest<{ Querystring: { page: string } }>;
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
            return reply.send({ assets, pages: Math.ceil(totalItems / 20) });
        } catch (error) {
            return reply.status(500).send({ error: "An error occured" });
        }
    });

    type PackageReq = FastifyRequest<{ Params: { package: string } }>;
    app.get("/api/packages/:package", async (request: PackageReq, reply) => {
        try {
            const packageRow = await catalogAssets.findOne({
                where: { package_name: request.params.package }
            });
            if (!packageRow) return reply.status(404).send({ error: "Package not found!" });
            const details = {
                title: packageRow.get("title"),
                description: packageRow.get("description"),
                image: packageRow.get("image"),
                author: packageRow.get("author"),
                tags: packageRow.get("tags"),
                version: packageRow.get("version"),
                background_image: packageRow.get("background_image"),
                background_video: packageRow.get("background_video"),
                payload: packageRow.get("payload"),
                type: packageRow.get("type")
            };
            reply.send(details);
        } catch (error) {
            reply.status(500).send({ error: "An unexpected error occured" });
        }
    });

    type UploadReq = FastifyRequest<{ Headers: { psk: string; packagename: string } }>;
    type CreateReq = FastifyRequest<{
        Headers: { psk: string };
        Body: {
            uuid: string;
            title: string;
            image: string;
            author: string;
            version: string;
            description: string;
            tags: object | any;
            payload: string;
            background_video: string;
            background_image: string;
            type: CatalogType;
        };
    }>;
    interface VerifyStatus {
        status: number;
        error?: Error;
    }
    async function verifyReq(
        request: UploadReq | CreateReq,
        upload: Boolean,
        data: any
    ): Promise<VerifyStatus> {
        if (request.headers.psk !== parsedDoc.marketplace.psk) {
            return { status: 403, error: new Error("PSK isn't correct!") };
        } else if (upload && !request.headers.packagename) {
            return { status: 500, error: new Error("No packagename defined!") };
        } else if (upload && !data) {
            return { status: 400, error: new Error("No file uploaded!") };
        } else {
            return { status: 200 };
        }
    }

    app.post("/api/upload-asset", async (request: UploadReq, reply) => {
        const data = await request.file();
        const verify: VerifyStatus = await verifyReq(request, true, data);
        if (verify.error !== undefined) {
            reply.status(verify.status).send({ status: verify.error.message });
        } else {
            try {
                await pipeline(
                    data.file,
                    createWriteStream(
                        fileURLToPath(
                            new URL(
                                `../database_assets/${request.headers.packagename}/${data.filename}`,
                                import.meta.url
                            )
                        )
                    )
                );
            } catch (error) {
                return reply.status(500).send({
                    status: `File couldn't be uploaded! (Package most likely doesn't exist)`
                });
            }
            return reply.status(verify.status).send({ status: "File uploaded successfully!" });
        }
    });

    app.post("/api/create-package", async (request: CreateReq, reply) => {
        const verify: VerifyStatus = await verifyReq(request, false, undefined);
        if (verify.error !== undefined) {
            reply.status(verify.status).send({ status: verify.error.message });
        } else {
            const body: Catalog = {
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
            };
            await catalogAssets.create({
                package_name: body.package_name,
                title: body.title,
                image: body.image,
                author: body.author,
                version: body.version,
                description: body.description,
                tags: body.tags,
                payload: body.payload,
                background_video: body.background_video,
                background_image: body.background_image,
                type: body.type
            });
            const assets = fileURLToPath(new URL("../database_assets", import.meta.url));
            try {
                await access(`${assets}/${body.package_name}/`, constants.F_OK);
                return reply.status(500).send({ status: "Package already exists!" });
            } catch (err) {
                await mkdir(`${assets}/${body.package_name}/`);
                return reply
                    .status(verify.status)
                    .send({ status: "Package created successfully!" });
            }
        }
    });
}

export { marketplaceAPI, db, catalogAssets, Catalog, CatalogModel };
