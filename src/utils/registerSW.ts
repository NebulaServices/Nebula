import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { Settings, WispServerURLS } from "./settings/index";

let baremuxConn: BareMuxConnection;
let swReg: ServiceWorkerRegistration;

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
        const checkScript = setInterval(() => {
            if (typeof __uv$config !== "undefined") {
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
    //this is wrapped in a promise to mostly solve the bare-mux v1 problems
    return new Promise<ServiceWorkerRegistration>((resolve) => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(async (reg) => {
                console.debug("Service worker ready!");
                resolve(reg);
            });
            navigator.serviceWorker.register("/sw.js", { scope: "/" });
        }
    });
}

interface SWStuff {
    sw: ServiceWorkerRegistration;
    conn: BareMuxConnection;
}

function setSWStuff(stuff: SWStuff): Promise<void> {
    return new Promise<void>((resolve) => {
        swReg = stuff.sw;
        baremuxConn = stuff.conn;
        resolve();
    });
}

function getSWStuff(): SWStuff {
    const stuff: SWStuff = {
        sw: swReg,
        conn: baremuxConn
    };
    return stuff;
}

export { initSw, setTransport, loadProxyScripts, setSWStuff, getSWStuff };
