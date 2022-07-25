import createBareServer from '@tomphttp/bare-server-node';
import http from 'http';
import https from 'https';
import nodeStatic from 'node-static';
import fs from 'fs';
import * as custombare from './static/customBare.mjs';

const bareServer = createBareServer('/bare/', {
	logErrors: false,
	localAddress: undefined,
	maintainer: {
		email: 'tomphttp@sys32.dev',
		website: 'https://github.com/tomphttp/',
	},
});

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
    
    if (bareServer.shouldRoute(request)) {
	    bareServer.routeRequest(request, response);
	} else {
	    serve.serve(request, response);
	}
}

function upgrade (req, socket, head) {
    if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
}

httpServer.listen(80);
httpsServer.listen(443);

console.log("Server running on port 80 and 443.");
