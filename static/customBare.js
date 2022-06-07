const fetch = require('node-fetch');
const fs = require('fs');

const config = {
  prefix: "/service"
}

function rewriteJavascript(js) {
  var javascript = js.replace('window.location', 'document._dlocation')
  javascript = javascript.replace('document.location', 'document._dlocation')
  javascript = javascript.replace('location.', 'document._location.')
  return javascript
}

function insertScript(html, origin) {
  var res = `<!DOCTYPE html>
<html>
<head>
<script preload type="module" src="${origin}/cyclone.js"></script>
</head>
<body>
${html}
</body>
</html>`
  return res
} // 

async function fetchBare(url, res, req) {
  try {
    var origin = 'https' + "://" + req.rawHeaders[1]

    var options = {
      method: req.method,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
        cookies: req.cookies
      },
      credentials: "same-origin"
    }

    var request = await fetch(url.href, options);
    var contentType = request.headers.get('content-type') || 'application/javascript'

    if (contentType.includes('html') || contentType.includes('javascript')) {
      var doc = await request.text();
    }

    res.writeHead(200, "Sucess", {
      "content-type": contentType
    })

    if (contentType.includes('html')) {
      output = insertScript(doc, origin);
      res.end(output)
    } else if (contentType.includes('javascript')) {
      output = rewriteJavascript(doc)
      res.end(output)
    } else {
      request.body.pipe(res)
    }


  } catch (e) {
    console.log(e);

    res.end(e)
  }
}

async function route(req, res) {
  var path = req.url;

  if (path.startsWith(config.prefix + "/")) {

    try {
      var url = new URL(path.split(config.prefix + "/")[1])
    } catch {
      var url = new URL("https://" + path.split(config.prefix + "/")[1])
    }

    fetchBare(url, res, req);

  } else {
    if (path === "/cyclone.js") {
      var file = fs.readFileSync(__dirname + '/cyclone.js', 'utf8')
      res.writeHead(200, 'Sucess', {
        "content-type": 'application/javascript'
      })
      res.end(file)
    }
    if (path === "/sw.js") {
      var file = fs.readFileSync(__dirname + '/sw.js', 'utf8')
      res.writeHead(200, 'Sucess', {
        "content-type": 'application/javascript'
      })
      res.end(file)
    }
  }
}

function isBare(req, res) {
  res.writeHead(200, "Sucess", {
    "Cros-Origin": "Access-Control-Allow-Origin"
  })
  return (req.url === "/cyclone.js" || req.url === "/cySw.js") || req.url.startsWith(config.prefix);
}

module.exports = {
  route,
  isBare
}