import fetch from 'node-fetch';
import { URL } from 'url';
import fs from 'fs';
import * as csstree from 'css-tree';
import * as ws from 'ws';

const config = {
  prefix: "/service",
  requireSSL: true, // Requires SSL?
  defaultHeaders: {
    'X-Content-Type-Options': 'no-sniff',
  },
  //proxy: {    
  //  host: "3.211.17.212",
  //  port: "80"
  //} // HTTP Proxy
}

if (config.requireSSL) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
} else {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

function rewriteJavascript(js) {
  var javascript = js.replace('window.location', 'document._dlocation')
  javascript = javascript.replace('document.location', 'document._dlocation')
  javascript = javascript.replace('location.', 'document._location.')
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
} // 

async function fetchBare(url, res, req) {
  try {
    var options = {
      method: req.method,
      headers: {
        "Refer": url.href,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
        "cookies": req.cookies,
      },
    }

    try {
      var request = await fetch(url.href, options);
    } catch (e) {
      var request = {
        text() {
          return 'Error: '+e;
        },
        
      }
    }
    
    try {
      var contentType = request.headers.get('content-type') || 'application/javascript'
    } catch {
      var contentType = 'application/javascript';
    }

    if (url.href.endsWith('.js')||url.href.endsWith(".js")) contentType = "application/javascript";
    if (url.href.endsWith('.css')||url.href.endsWith(".css")) contentType = "text/css";
    
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
    console.log(e);
    res.writeHead(500, 'Error', {
      'content-type': 'application/javascript'
    })
    res.end(e)
  }
}

function websocketIntercept(req,res) {
  console.log(req);
}

function route(req, res) {
  var path = req.url;

  if (path.startsWith(config.prefix + "/")) {
    try {
      var url = new URL(path.split(config.prefix + "/")[1])
    } catch {
      var url = new URL("https://" + path.split(config.prefix + "/")[1])
    }
    
    fetchBare(url, res,req);

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
    var url = new URL(path.split(config.prefix + "/")[1])
  } catch {
    var url = new URL("wss://" + path.split(config.prefix + "/")[1])
  }

  console.log(url);
}

export {
  route,
  routeSocket,
  isBare,
}
