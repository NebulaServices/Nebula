import { defaultStore } from "./storage";
import { SettingsVals, WispServers } from "./values";
import { Marketplace } from "./marketplace";
import { setTransport, SW } from "./serviceWorker";

const tab = {
    ab: (redirect: string) => {
        window.location.replace(redirect);
        const win = window.open();
        const iframe = win!.document.createElement("iframe") as HTMLIFrameElement;
        win!.document.body.setAttribute('style', 'margin: 0; height: 100vh; width: 100%;');
        iframe.setAttribute('style', 'border: none; width: 100%; height: 100%; margin: 0;');
        iframe.src = window.location.href;
        win!.document.body.appendChild(iframe);
    },
    blob: (redirect: string) => {
        const content = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style type="text/css">
                        body, html {
                            margin: 0;
                            padding: 0;
                            height: 100%;
                            width: 100%;
                            overflow: hidden;
                        }
                    </style>
                </head>
                <body>
                    <iframe style="border: none; width: 100%; height: 100%;" src="${window.location.href}"></iframe>
                </body>
            </html>
        `;
        window.location.replace(redirect);
        const blob = new Blob([content], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), "_blank");
    },
    cloak: (cloak: string) => {
        const fElem = document.getElementById("favicon")! as HTMLLinkElement;
        const c = (title: string, href: string) => {
            document.title = title;
            fElem.href = href;
        }
        switch(cloak) {
            case "google": {
                c("Google", "/cloaks/google.png");
                break;
            }
            case "wikipedia": {
                c("Wikipedia", "/cloaks/wikipedia.ico");
                break;
            }
            case "canvas": {
                c("Dashboard", "/cloaks/canvas.ico");
                break;
            }
            case "classroom": {
                c("Home", "/cloaks/classroom.ico");
                break;
            }
            case "powerschool": {
                c("PowerSchool", "/cloaks/ps.ico");
                break;
            }
            case "reset": {
                defaultStore.setVal(SettingsVals.tab.cloak, "default");
                window.location.reload();
            }
            default: {
                return;
            }
        }
    }
}

const proxy = {
    change: (proxy: "uv" | "sj" | "automatic") => {
        defaultStore.setVal(SettingsVals.proxy.proxy.key, proxy);
    },
    searchEngine: (s: string) => {
        defaultStore.setVal(SettingsVals.proxy.searchEngine, s);
    },
    wisp: (s: string) => {
        defaultStore.setVal(SettingsVals.proxy.wispServer, s);
    },
    transport: async (t: "libcurl" | "epoxy") => {
        const sw = SW.getInstances().next().value!;
        const { bareMuxConn } = await sw.getSWInfo();
        await setTransport(bareMuxConn, t as "libcurl" | "epoxy");
        defaultStore.setVal(SettingsVals.proxy.transport.key, t);
    }
}

async function* initDefaults() {
    yield proxy.change(defaultStore.getVal(SettingsVals.proxy.proxy.key) ? defaultStore.getVal(SettingsVals.proxy.proxy.key) as "uv" | "sj" | "automatic" : "automatic");
    yield proxy.wisp(defaultStore.getVal(SettingsVals.proxy.wispServer) ? defaultStore.getVal(SettingsVals.proxy.wispServer) : "default");
    yield proxy.transport(defaultStore.getVal(SettingsVals.proxy.transport.key) ? defaultStore.getVal(SettingsVals.proxy.transport.key) as "libcurl" | "epoxy" : "libcurl");
    yield proxy.searchEngine(defaultStore.getVal(SettingsVals.proxy.searchEngine) ? defaultStore.getVal(SettingsVals.proxy.searchEngine) : "ddg");
}

const Settings = {
    tab,
    proxy,
    initDefaults
}

export { Settings };
