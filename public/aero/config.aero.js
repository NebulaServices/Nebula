/** @import { Config } from "aero-proxy" */

/**
 * @type {string}
 */
const escapeKeyword = "_";
/**
 * @type {string}
 */
const dirToAero = "/aero/";

/**
 * @type {Config}
 */
self.aeroConfig = {
	bc: new BareMux(),
    serverBackendPrefix: "/bare/", 
    prefix: "/~/aero/",
	pathToInitialSW: "/sw.js",
	bundles: {
		"bare-mux": `${dirToAero}BareMux.aero.js`,
		handle: `${dirToAero}sw.aero.js`,
		sandbox: `${dirToAero}sandbox/sandbox.aero.js`
	},
	aeroPathFilter: path =>
		Object.values(self.config.bundles).find(bundlePath =>
			path.startsWith(bundlePath)
		) === null ||
		path.startsWith("/tests/") ||
		path.startsWith("/baremux") ||
		path.startsWith("/epoxy/") ||
		!path.startsWith(aeroConfig.prefix),
	searchParamOptions: {
		referrerPolicy: {
			escapeKeyword,
			searchParam: "passthroughReferrerPolicy"
		},
		isModule: {
			escapeKeyword,
			searchParam: "isModule"
		},
		integrity: {
			escapeKeyword,
			searchParam: "integrity"
		}
	},
	cacheKey: "httpCache",
	dynamicConfig: {
		dbName: "aero",
		id: "update"
	},
	//urlEncoder: __uv$config.urlEncoder,
	//urlDecoder: __uv$config.urlDecoder,
	urlEncoder: url => url,
	urlDecoder: url => url
};
