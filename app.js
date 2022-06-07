import Server from 'bare-server-node';
import https from 'https';
import nodeStatic from 'node-static';
import fs from 'fs';

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
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    const isLS = ip.startsWith('34.216.110') || ip.startsWith('54.244.51') || ip.startsWith('54.172.60') || ip.startsWith('34.203.250') || ip.startsWith('34.203.254') || ['18.237.145.219', '34.213.241.18', '54.184.142.71', '34.219.54.89', '52.13.31.12', '52.89.157.185', '34.208.60.206', '3.80.101.141', '54.90.242.158', '54.172.185.65', '3.83.250.144', '18.209.180.25', '54.167.181.168', '54.166.136.197', '52.207.207.52', '54.252.242.153', '3.104.121.59', '34.253.198.121', '63.33.56.11', '34.250.114.219', '54.171.251.199'].includes(ip);

    const unlockNow = request.url === '/?unlock';
    if (unlockNow)
        response.setHeader('Set-Cookie', ['key=standard; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/']);
    const unlockPatronNow = request.url === '/?unlockPatron';
    if (unlockPatronNow)
        response.setHeader('Set-Cookie', ['key=patron; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/']);

    const unlocked = request.headers['cookie'] === 'key=standard' || unlockNow;
    const patronUnlocked = request.headers['cookie'] === 'key=patron' || unlockPatronNow;

    if (bare.route_request(request, response))
        return true;

    if (!(unlocked || patronUnlocked) && (isLS || request.headers.host === 'nebulaproxy.nebula.bio' && !request.headers['user-agent'].match(/CrOS/)))
        fakeServe.serve(request, response);
    else {
        if (bare.route_request(request, response))
            return true;

        if (patronUnlocked)
            patronServe.serve(request, response);
        else
            serve.serve(request, response);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head))
        return;

    socket.end();
});

server.listen(443);