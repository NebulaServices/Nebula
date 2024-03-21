importScripts("/epoxy/index.js");
importScripts("/libcurl/index.js");
importScripts("/transports/bareTransport.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts(__uv$config.sw || "/uv/uv.sw.js");
importScripts("/dynamic/dynamic.config.js");
importScripts("/dynamic/dynamic.worker.js");
//import our IDB lib
importScripts("/localforage/localforage.min.js");
localforage.config({
  driver: localforage.INDEXEDDB,
  name: "Nebula",
  version: 1.0,
  storeName: "nebula_config",
  description: "Nebula Config for things reliant on IndexedDB"
});

const uv = new UVServiceWorker();
const dynPromise = new Promise(async (resolve) => {
  try {
    const bare =
      (await localforage.getItem("bare")) || location.origin + "/bare/";
    self.__dynamic$config.bare.path = bare;
    self.dynamic = new Dynamic(self.__dynamic$config);
  } catch (error) {
    console.log(error);
  }
  resolve();
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.startsWith(location.origin + self.__dynamic$config.prefix)
  ) {
    event.respondWith(
      (async function () {
        try {
          await dynPromise;
        } catch (error) {}
        if (await self.dynamic.route(event)) {
          return await self.dynamic.fetch(event);
        }
        await fetch(event.request);
      })()
    );
  } else if (
    event.request.url.startsWith(location.origin + __uv$config.prefix)
  ) {
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
