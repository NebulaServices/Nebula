import { createServer } from "node:http";
import rammerhead from "@rubynetwork/rammerhead";
import { FastifyServerFactory, FastifyServerFactoryHandler, RawServerDefault } from "fastify";
import wisp from "wisp-server-node";
import { LOG_LEVEL, WispOptions } from "wisp-server-node/dist/Types.js";
import { parsedDoc } from "./config.js";

const rh = rammerhead.createRammerhead({
    logLevel: parsedDoc.server.server.logging ? "debug" : "disabled",
    reverseProxy: parsedDoc.server.rammerhead.reverseproxy,
    disableLocalStorageSync: parsedDoc.server.rammerhead.localstorage_sync ? false : true,
    disableHttp2: parsedDoc.server.rammerhead.http2 ? false : true
});

const wispOptions: WispOptions = {
    logLevel: parsedDoc.server.server.logging ? LOG_LEVEL.DEBUG : LOG_LEVEL.NONE,
    pingInterval: 30
};

const serverFactory: FastifyServerFactory = (
    handler: FastifyServerFactoryHandler
): RawServerDefault => {
    const httpServer = createServer();
    httpServer.on("request", (req, res) => {
        if (rammerhead.shouldRouteRh(req)) {
            rammerhead.routeRhRequest(rh, req, res);
        } else {
            handler(req, res);
        }
    });
    httpServer.on("upgrade", (req, socket, head) => {
        if (rammerhead.shouldRouteRh(req)) {
            rammerhead.routeRhUpgrade(rh, req, socket, head);
        } else if (parsedDoc.server.server.wisp) {
            if (req.url?.endsWith("/wisp/")) {
                wisp.routeRequest(req, socket as any, head, wispOptions);
            }
        }
    });
    return httpServer;
};

export { serverFactory };
