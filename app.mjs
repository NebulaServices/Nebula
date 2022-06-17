import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';
import fs from 'fs';
import * as custombare from './static/customBare.mjs';

const bare = new Server('/bare/', '');

const serve = new nodeStatic.Server('static/');
const patronServe = new nodeStatic.Server('static/');
const fakeServe = new nodeStatic.Server('fakeStatic/');

const server = https.createServer();

fs.readdir('/etc/letsencrypt/live', { withFileTypes: true }, (err, files) => {
    if (!err)
        files
        .filter(file => file.isDirectory())
        .map(folder => folder.name)
        .forEach(dir => {
            server.addContext(dir, {
                key: fs.readFileSync(`/etc/letsencrypt/live/${dir}/privkey.pem`),
                cert: fs.readFileSync(`/etc/letsencrypt/live/${dir}/fullchain.pem`)
            });
        });
});

server.on('request', (request, response) => {
    if (custombare.route(request, response)) return true;
    
    if (bare.route_request(request, response)) return true;
    serve.serve(request, response);
});

server.on('upgrade', (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head))
        return;

    socket.end();
});

server.listen(443);
