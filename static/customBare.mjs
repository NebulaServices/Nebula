import fetch from 'node-fetch';
import { URL } from 'url';
import fs from 'fs';
import * as csstree from 'css-tree';
import * as ws from 'ws';
import filter from './cyclone/filter.cyclone.mjs';
import * as security from './cyclone/security.cyclone.mjs';

const config = {
    prefix: "/service/next",
    requireSSL: true, // Requires SSL?
    defaultHeaders: {
        'X-Content-Type-Options': 'no-sniff',
    },
}

if (config.requireSSL) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
} else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function rewriteJavascript(js) {
    var javascript = js.replace(/window\.location/g, 'window._dlocation')
    javascript = javascript.replace(/document\.location/g, 'document._dlocation')
    javascript = javascript.replace(/location\./g, '_location.')
    return javascript
}

function insertScript(html) {
    var res = `<!DOCTYPE html>
  <html>
  <head>
  <script preload src="/cyclone/cyclone.js"></script>
  </head>
  <body>
  ${html}
  </body>
  </html>`
    return res
}

async function fetchBare(url, res, req) {
    try {
        var options = {
            method: req.method,
            headers: {
                "Referer": url.href,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
                "Cookie": req.headers.cookie,
            },
        }

        var request = await fetch(url.href, options);

        try {
            var contentType = request.headers.get('content-type') || 'application/javascript'
        } catch {
            var contentType = 'application/javascript';
        }

        if (url.href.endsWith('.js') || url.href.endsWith(".js")) contentType = "application/javascript";
        if (url.href.endsWith('.css') || url.href.endsWith(".css")) contentType = "text/css";

        var output = null;

        if (contentType.includes('html') || contentType.includes('javascript')) {
            var doc = await request.text();
        }

        res.setHeader('content-type', contentType);

        if (contentType.includes('html')) {
            output = insertScript(doc);
            res.write(output);
            res.end();
        } else if (contentType.includes('javascript')) {
            output = rewriteJavascript(doc)
            res.write(output);
            res.end()
        } else {
            request.body.pipe(res)
        }
    } catch (e) {
        res.writeHead(500, 'Internal Server Error', {
            'Content-Type': 'text/plain'
        })
        res.end(e.stack);
    }
}

function websocketIntercept(req, res) {
    console.log(req);
}

function route(req, res) {
    var path = req.url;

    if (path.startsWith(config.prefix + "/")) {
        var decoded = path.split(config.prefix + "/")[1];

        try {
            var url = new URL(decoded);
        } catch {
            var url = new URL("https://" + decoded);
        }

        if (filter(req, res)) return;

        return fetchBare(url, res, req);

    } else {
        return false;
    }
}

function isBare(req, res) {
    return (req.url.startsWith(config.prefix));
}

function routeSocket(req, socket) {
    var path = req.url;

    try {
        var url = new URL(path(config.prefix + "/")[1])
    } catch {
        var url = new URL("wss://" + path(config.prefix + "/")[1])
    }

    console.log(url);
}

export {
    route,
    routeSocket,
    isBare,
}
