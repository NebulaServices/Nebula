importScripts("/epoxy/index.js");
importScripts("/libcurl/index.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts(__uv$config.sw || "/uv/uv.sw.js");
const uv = new UVServiceWorker();

//where we handle our plugins!!!
self.addEventListener("message", function(event) {
    //console.log(event.data);
    if (uv.config.inject === undefined) {
        uv.config.inject = [];
    }
    //loop over the required data (we don't verify here as types will take care of us :D)
    event.data.forEach((data) => { 
        if (data.remove) {
            if (uv.config.inject.find(({ host }) => host === data.host)) {
                const idx = uv.config.inject.indexOf(data.host);
                uv.config.inject.splice(idx, 1);
            }
        }
        else {
            if (!uv.config.inject.find(({ host }) => host === data.host)) {
                uv.config.inject.push({
                    host: data.host,
                    html: data.html,
                    injectTo: data.injectTo
                });
            }
        }
    });
    console.log(uv.config.inject);
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        event.respondWith(
            (async function () {
                return await uv.fetch(event);
            })()
        );
    } else {
        event.respondWith(
            (async function () {
                return await fetch(event.request);
            })()
        );
    }
});
