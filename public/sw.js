/**
 * @type {string}
 */
const dirToUV = "/uv/";
/**
 * @type {string}
 */
const dirToAero = "/aero/";
importScripts('/epoxy/index.js');
importScripts(`${dirToUV}uv.bundle.js`);
importScripts(`${dirToUV}uv.config.js`);
importScripts(__uv$config.sw || `${dirToUV}uv.sw.js`);
importScripts(`${dirToAero}defaultConfig.aero.js`);
importScripts(`${dirToAero}config.aero.js`);
importScripts(aeroConfig.bundles["bare-mux"]);
importScripts(aeroConfig.bundles.handle);
importScripts(`${dirToAero}/extras/handleWithExtras.js`);
const uv = new UVServiceWorker();
const aeroHandlerWithExtras = patchAeroHandler(handle);
self.addEventListener('fetch', function (event) {
    if (event.request.url.startsWith(location.origin + __uv$config.prefix))
		  return event.respondWith(uv.fetch(event));
    if (routeAero(event)) return event.respondWith(aeroHandlerWithExtras(event));
});
