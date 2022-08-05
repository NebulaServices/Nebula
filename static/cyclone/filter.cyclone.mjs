import fs from 'fs';

const xor = {
    encode: (url) => encodeURIComponent(url.toString().split("").map((char, ind) => ind % 2 ? String
        .fromCharCode(char.charCodeAt() ^ 2) : char).join("")),
    decode: (url) => decodeURIComponent(url.split("?")[0]).split("").map((char, ind) => ind % 2 ? String
        .fromCharCode(char.charCodeAt(0) ^ 2) : char).join("") + (url.split("?").slice(1).length ? "?" +
        url.split("?").slice(1).join("?") : "")
}

function getBlockPage(site, reason) {
    return `<!DOCTYPE html>
<html>

<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');

    body {
      background-color: #ff4f4f;
      color: white;
      font-family: 'Roboto', sans-serif;
    }

    p {
      font-size: 54px;
    }
  </style>
</head>

<body>
  <center>
    <p>Access Denied</p>
    
    <div class="main">
      <img src="/images/denied_sign.svg" width="200" onclick="location.pathname = '/service/google.com'">
    </div>

    <a style="position: absolute; bottom: 10; right: 0; left: 0; display: inline;">
      Looks like ${site} is blocked for ${reason}
    </a>
    
  </center>

</body>

</html>`
}

const blacklist = [
    'netflix.com',
    'www.netflix.com',
    'accounts.google.com',
]

function filter(req, res) {
    var decode = req.url.split("/service/")[1];

    decode = decode.replace("http://", '')
    decode = decode.replace("https://", '')
    decode = decode.replace("http:/", '')
    decode = decode.replace("https:/", '')

    decode = 'https://' + decode;

    var uri = new URL(decode);

    var toBlock = (blacklist.includes(uri.host));

    if (toBlock) {
        var b = getBlockPage(uri.host, 'cyclone__DenyURL');
        res.end(b);
        return true;
    } else {
        return false
    }
}

export {
    filter as
    default
} // don't want Netflix's legal team to go sicko mode