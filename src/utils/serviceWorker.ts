import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { defaultStore } from "./storage";
import { SettingsVals, WispServers } from "./values";

/**
    * Creates a script element and returns it for usage or more modification.
    *
    * @example
    * const script = createScript("/scram/scramjet.controller.js", true);
    * document.body.appendChild(script);
*/
const createScript = (src: string, defer?: boolean): HTMLScriptElement => {
    const script = document.createElement('script') as HTMLScriptElement;
    script.src = src;
    if (defer) script.defer = defer;
    return script;
};

/**
    * A generator function to create and load our proxy scripts. Allows us to pause and continue when needed.
    *
    * @example
    * const proxyScripts = createProxyScripts();
    * if (proxyScripts.next().value) document.body.appendChild(proxyScripts.next().value)
    * // We can now check to see if that script is there or not and then continue after.
*/
function* createProxyScripts() {
    const uv = createScript("/uv/uv.bundle.js", true);
    yield uv;
    const sj = createScript("/scram/scramjet.controller.js", true);
    yield sj;
};

/** 
    * Creates a bareMux connection an returns it the instantiated instance as a promise.
    *
    * @example
    * const conn = createBareMuxConn("/baremux/worker.js");
*/
const createBareMuxConn = (worker: string): Promise<BareMuxConnection> => {
    return new Promise<BareMuxConnection>((resolve) => {
        const conn = new BareMuxConnection(worker);
        resolve(conn);
    });
};

/**
    * Sets a transport via an already active BareMux connection. The options are libcurl or epoxy and returns a void promise.
    *
    *
    * @example 
    * const conn = createBareMuxConn("/baremux/worker.js");
    * setTransport(conn, "libcurl");
*/
const setTransport = (conn: BareMuxConnection,  transport?: "libcurl" | "epoxy"): Promise<void> => {
    const server = defaultStore.getVal(SettingsVals.proxy.wispServer); 
    return new Promise((resolve) => {
        console.log(`Set wisp server at: ${server ? WispServers[server]: WispServers.default }`);
        if (transport === "epoxy") return resolve(conn.setTransport("/epoxy/index.mjs", [ { wisp: server ? WispServers[server] : WispServers.default }]));
        if (transport === "libcurl") return resolve(conn.setTransport("/libcurl/index.msj", [ { wisp: server ? WispServers[server] : WispServers.default }]));
    });
};

type SWInit = {
    serviceWorker: ServiceWorkerRegistration;
    sj: ScramjetController;
    bareMuxConn: BareMuxConnection;
}

/**
    * This class automatically sets up and registers our service worker.
    *
    * @example
    * const sw = new SW();
    * sw.getSWInfo() // Returns an object with the service worker, scramjet controller instance and the baremux connection all in one method
    * sw.setSWInfo() // Allows one to override the info returned from getSWInfo() should be used sparingly or never.
*/
class SW {
    #init!: SWInit;
    constructor(conn: BareMuxConnection) {
        const sj = async (): Promise<ScramjetController> => {
            const sj = new ScramjetController({
                prefix: '/~/scramjet',
                files: {
                    wasm: "/scram/scramjet.wasm.js",
                    worker: "/scram/scramjet.worker.js",
                    client: "/scram/scramjet.client.js",
                    shared: "/scram/scramjet.shared.js",
                    sync: "/scram/scramjet.sync.js"
                }
            });
            await sj.init();
            return sj;
        }
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(async (reg) => {
                console.log("Service worker ready and active!");
                this.#init = { serviceWorker: reg, sj: await sj(), bareMuxConn: conn }
            });
            navigator.serviceWorker.register("/sw.js", { scope: '/' });
        }
        else {
            throw new Error('Your browser is not supported! This website uses Service Workers heavily.');
        }
    }
    
    /**
        * Allows you to overrid the items set. Should be used sparingly or never.
    */
    setSWInfo(items: SWInit): void {
        this.#init = { serviceWorker: items.serviceWorker, sj: items.sj, bareMuxConn: items.bareMuxConn }
    }
    
    /**
        * Returns an object with the service worker, scramjet controller and baremux connection all in one method.
    */
    getSWInfo(): SWInit {
        return this.#init;
    }
}

export { createScript, createProxyScripts, createBareMuxConn, setTransport, SW }; 
