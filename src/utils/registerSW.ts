import { WispServerURLS, Settings } from "./settings";
function loadProxyScripts() {
    //wrap everything in a promise to avoid race conditions
    return new Promise<void>((resolve) => {
        //create and append then scripts tags to the body (this is how we lazy load things)
        const epoxyScript = document.createElement('script');
        epoxyScript.src = '/epoxy/index.js';
        epoxyScript.defer = true;
        document.body.appendChild(epoxyScript);
        const libCurlScript = document.createElement('script');
        libCurlScript.src = '/libcurl/index.js';
        libCurlScript.defer = true;
        document.body.appendChild(libCurlScript);
        const uvBundle = document.createElement('script');
        uvBundle.src = '/uv/uv.bundle.js';
        uvBundle.defer = true;
        document.body.appendChild(uvBundle);
        const uvConfig = document.createElement('script');
        uvConfig.src = '/uv/uv.config.js';
        uvConfig.defer = true;
        document.body.appendChild(uvConfig);
        const bareMux = document.createElement('script');
        bareMux.src = '/baremux/bare.cjs';
        bareMux.defer = true;
        document.body.appendChild(bareMux);
        const checkScripts = setInterval(() => {
            //If both of these aren't defined this will repeat until they are
            //this allows use to wait for all of the scripts to be ready *before* we setup the serviceworker
            if (typeof EpxMod !== 'undefined' && typeof BareMux !== 'undefined') {
                clearInterval(checkScripts);
                resolve();
            }
        }, 100);
    })
}

function setTransport(transport?: string) {
    //wrap in a promise so we don't register sw until a transport is set.
    const wispServer = localStorage.getItem(Settings.ProxySettings.wispServerURL);
    return new Promise<void>((resolve) => {
        switch(transport) {
            case "epoxy":
                BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispServer ? WispServerURLS[wispServer] : WispServerURLS.default });
                break;
            case "libcurl":
                BareMux.SetTransport("CurlMod.LibcurlClient", { wisp: wispServer? WispServerURLS[wispServer]: WispServerURLS.default});
                break;
        }
        resolve();
    });
}

function initSw() {
    //this is wrapped in a promise to mostly solve the bare-mux v1 problems
    return new Promise<void>((resolve) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(async () => {
                console.debug('Service worker ready!');
                await loadProxyScripts();
                resolve();
            });
            navigator.serviceWorker.register('/sw.js', { scope: '/' });
        }
    })
}

export { initSw, setTransport }
