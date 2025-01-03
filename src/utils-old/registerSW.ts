import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { Settings, WispServerURLS } from "./settings/index";
let baremuxConn: BareMuxConnection;
let swReg: ServiceWorkerRegistration;
let sj: typeof ScramjetController;

function loadProxyScripts() {
    //wrap everything in a promise to avoid race conditions
    return new Promise<BareMuxConnection>((resolve) => {
        const conn = new BareMuxConnection("/baremux/worker.js");
        if (typeof __uv$config !== "undefined") {
            return resolve(conn);
        }
        const uvBundle = document.createElement("script");
        uvBundle.src = "/uv/uv.bundle.js";
        uvBundle.defer = true;
        document.body.appendChild(uvBundle);
        const uvConfig = document.createElement("script");
        uvConfig.src = "/uv/uv.config.js";
        uvConfig.defer = true;
        document.body.appendChild(uvConfig);
        const sj = document.createElement('script');
        sj.src = "/scram/scramjet.controller.js";
        sj.defer = true;
        document.body.appendChild(sj);
        const checkScript = setInterval(() => {
            if (typeof __uv$config !== "undefined" && typeof ScramjetController !== "undefined") {
                clearInterval(checkScript);
                resolve(conn);
            }
        }, 100);
    });
}

function setTransport(conn: BareMuxConnection, transport?: string) {
    //wrap in a promise so we don't register sw until a transport is set.
    const wispServer = localStorage.getItem(Settings.ProxySettings.wispServerURL);
    return new Promise<void>((resolve) => {
        console.log(`Wisp server set: ${wispServer ? WispServerURLS[wispServer] : WispServerURLS.default}`)
        switch (transport) {
            case "epoxy":
                conn.setTransport("/epoxy/index.mjs", [
                    { wisp: wispServer ? WispServerURLS[wispServer] : WispServerURLS.default }
                ]);
                break;
            case "libcurl":
                conn.setTransport("/libcurl/index.mjs", [
                    { wisp: wispServer ? WispServerURLS[wispServer] : WispServerURLS.default }
                ]);
                break;
        }
        resolve();
    });
}

function initSw() {
    type SWPromise = {
        sw: ServiceWorkerRegistration,
        sj: ScramjetController
    }
    //this is wrapped in a promise to mostly solve the bare-mux v1 problems
    return new Promise<SWPromise>(async (resolve) => {
        if ("serviceWorker" in navigator) {
            const sjOpts = {
                prefix: "/~/scramjet/",
                files: {
                    wasm: "/scram/scramjet.wasm.js",
                    worker: "/scram/scramjet.worker.js",
                    client: "/scram/scramjet.client.js",
                    shared: "/scram/scramjet.shared.js",
                    sync: "/scram/scramjet.sync.js"
                }
            }
            const sj = new ScramjetController(sjOpts);
            navigator.serviceWorker.ready.then(async (reg) => {
                console.debug("Service worker ready!");
                resolve({ sw: reg, sj: sj });
            });
            await sj.init('/sw.js');
            //navigator.serviceWorker.register("/sw.js", { scope: "/" });
        }
    });
}

interface SWStuff {
    sw: ServiceWorkerRegistration;
    conn: BareMuxConnection;
    sj: typeof ScramjetController;
}

function setSWStuff(stuff: SWStuff): Promise<void> {
    return new Promise<void>((resolve) => {
        swReg = stuff.sw;
        baremuxConn = stuff.conn;
        sj = stuff.sj;
        resolve();
    });
}

function getSWStuff(): SWStuff {
    const stuff: SWStuff = {
        sw: swReg,
        conn: baremuxConn,
        sj: sj
    };
    return stuff;
}

export { initSw, setTransport, loadProxyScripts, setSWStuff, getSWStuff };
