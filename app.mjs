import Server from 'bare-server-node';
import http from 'http';
import https from 'https';
import nodeStatic from 'node-static';
import fs from 'fs';
import * as custombare from './static/customBare.mjs';

const bare = new Server('/bare/', '');

const serve = new nodeStatic.Server('static/');
const patronServe = new nodeStatic.Server('static/');
const fakeServe = new nodeStatic.Server('fakeStatic/');

const httpServer = http.createServer();
const httpsServer = https.createServer();

fs.readdir('/etc/letsencrypt/live', { withFileTypes: true }, (err, files) => {
    if (!err)
        files
        .filter(file => file.isDirectory())
        .map(folder => folder.name)
        .forEach(dir => {
            httpsServer.addContext(dir, {
                key: fs.readFileSync(`/etc/letsencrypt/live/${dir}/privkey.pem`),
                cert: fs.readFileSync(`/etc/letsencrypt/live/${dir}/fullchain.pem`)
            });
        });
});

httpServer.on('request', request);
httpsServer.on('request', request);
httpServer.on('upgrade', upgrade);
httpsServer.on('upgrade', upgrade);

function request (request, response) {
    if (custombare.route(request, response)) return true;
    
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
}

function upgrade (req, socket, head) {
    if (bare.route_upgrade(req, socket, head))
        return;

    socket.end();
}

httpServer.listen(80);
httpsServer.listen(443);
