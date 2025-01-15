import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { defaultStore } from "./storage";
import { SettingsVals, WispServers } from "./values";
import { log } from "./index";

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
    const uvConfig = createScript("/uv/uv.config.js", true);
    yield uvConfig;
    const sj = createScript("/scram/scramjet.controller.js", true);
    yield sj;
};

/**
    * Function that resolves ONLY when uv and Scramjet are not undefined. This prevents us from using these values before they are added and executed.
    *
    * @example
    * await checkProxyScripts();
    * @example 
    * checkProxyScripts().then(() => { // Do something });
*/
const checkProxyScripts = (): Promise<void> => {
    return new Promise((resolve) => {
        const checkScript = setInterval(() => {
            if (typeof __uv$config !== "undefined" && typeof ScramjetController !== "undefined") {
                clearInterval(checkScript);
                resolve();
            }
        }, 100);
    });
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
        log({ type: 'info', bg: false, prefix: false }, `Set transport: ${transport ? transport : "libcurl"}`);
        log({ type: 'info', bg: false, prefix: false }, `Set wisp server at: ${server ? WispServers[server]: WispServers.default }`);
        if (transport === "epoxy") return resolve(conn.setTransport("/epoxy/index.mjs", [ { wisp: server ? WispServers[server] : WispServers.default }]));
        if (transport === "libcurl") return resolve(conn.setTransport("/libcurl/index.mjs", [ { wisp: server ? WispServers[server] : WispServers.default }]));
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
    #ready: boolean = false;
    static #instances = new Set();
    constructor(conn: BareMuxConnection) {
        SW.#instances.add(this);
        const sj = (): ScramjetController => {
            const sj = new ScramjetController({
                prefix: '/~/scramjet',
                files: {
                    wasm: "/scram/scramjet.wasm.js",
                    worker: "/scram/scramjet.worker.js",
                    client: "/scram/scramjet.client.js",
                    shared: "/scram/scramjet.shared.js",
                    sync: "/scram/scramjet.sync.js"
                },
                flags: {
                    rewriterLogs: false
                }
            });
            return sj;
        }
        if ("serviceWorker" in navigator) {
            (async () => { await navigator.serviceWorker.getRegistrations() })();
            const scram = sj();
            (async () => await scram.init())();
            navigator.serviceWorker.ready.then(async (reg) => {
                log({ type: 'info', prefix: true, bg: false }, 'ServiceWorker ready and active!');
                this.#init = { serviceWorker: reg, sj: scram, bareMuxConn: conn };
                this.#ready = true;
            });
            navigator.serviceWorker.register("/sw.js", { scope: '/' });
        }
        else {
            throw new Error('Your browser is not supported! This website uses Service Workers heavily.');
        }
    }

    /**
        * Static method to get an already existing SW class
        *
        *
        * @example
        * SW.getInstances.next().value // Get the first instance.
        *
        * @example 
        * // Loop through every instance
        * for (const sw of SW.getInstances()) {
            * console.log(sw) // DO some real work
        * }
    */
    static *getInstances() {
        for (const value of SW.#instances.keys()) {
            yield value as SW;
        }
    }
    /**
        * Allows you to overrid the items set. Should be used sparingly or never.
    */
    setSWInfo(items: SWInit): void {
        this.#init = { serviceWorker: items.serviceWorker, sj: items.sj, bareMuxConn: items.bareMuxConn };
        this.#ready = true;
    }
    
    /**
        * Returns a promise that resolves to the serviceWorker, scramjet controller and bareMux Connection ONLY when these values are ready.
        *
        * @example
        * const sw = new SW(conn); // "conn" must be a baremux connection that you created.
        * const swInfo = await sw.getSWInfo();
        *
        * @example
        * const sw = new SW(conn); // "conn" must be a baremux connection that you created
        * sw.getInfo().then((info) => { // Do something with said info }
    */
    getSWInfo(): Promise<SWInit> {
        return new Promise((resolve) => {
            const checkState = setInterval(() => {
                if (this.#ready) {
                    clearInterval(checkState);
                    resolve(this.#init);
                }
            }, 100);
        });
    }
}

export { createScript, createProxyScripts, checkProxyScripts, createBareMuxConn, setTransport, SW }; 
