import { createServer } from "node:http";
import { FastifyServerFactory, FastifyServerFactoryHandler, RawServerDefault } from "fastify";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";;
import { parsedDoc } from "./config.js";

const serverFactory: FastifyServerFactory = (
    handler: FastifyServerFactoryHandler
): RawServerDefault => {
    const httpServer = createServer();
    httpServer.on("request", (req, res) => {
        handler(req, res);
    });
    httpServer.on("upgrade", (req, socket, head) => {
        if (parsedDoc.server.server.wisp) {
            if (req.url?.endsWith("/wisp/")) {
                wisp.routeRequest(req, socket as any, head);
            }
        }
    });
    return httpServer;
};

export { serverFactory };
