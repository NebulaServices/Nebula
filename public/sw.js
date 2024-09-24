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
  event.respondWith(
    (async function () {
      if (uv.route(event)) {
        return await uv.fetch(event);
      }
      if (await dynamic.route(event)) {
        try {
          await dynPromise;
        } catch (e) {
          console.error(error)
        }
        return await dynamic.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});