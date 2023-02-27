importScripts("./uv/uv.bundle.js");
importScripts("./uv/uv.config.js");
importScripts("./uv/uv.sw.js");
importScripts("./osana/osana.worker.js");

const UV = new UVServiceWorker();
const Osana = new OsanaServiceWorker();

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(location.origin + "/service/go/"))
    event.respondWith(UV.fetch(event));
  if (event.request.url.startsWith(location.origin + "/service/~osana/"))
    event.respondWith(Osana.fetch(event));
});
