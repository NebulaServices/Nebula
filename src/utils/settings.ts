import { defaultStore } from "./storage";
import { SettingsVals, WispServers, preferredWispServer } from "./values";
import { Marketplace } from "./marketplace";
import { SW } from "./serviceWorker";

const tab = {
    ab: (redirect: string) => {
        const win = window.open();
        if (!win) return;
        window.location.replace(redirect);
        const iframe = win.document.createElement("iframe") as HTMLIFrameElement;
        win.document.body.setAttribute('style', 'margin: 0; height: 100vh; width: 100%;');
        iframe.setAttribute('style', 'border: none; width: 100%; height: 100%; margin: 0;');
        iframe.src = window.location.href;
        win.document.body.appendChild(iframe);
    },
    blob: (redirect: string) => {
        const win = window.open();
        if (!win) return;
        window.location.replace(redirect);
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
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        win.location.href = url;

    },
    cloak: async (cloak: string) => {
        const fElem = document.getElementById("favicon")! as HTMLLinkElement;
        const c = (title: string, href: string) => {
            document.title = title;
            fElem.href = href;
        }
        switch (cloak) {
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
                c("Home", "/cloaks/classroom.png");
                break;
            }
            case "powerschool": {
                c("PowerSchool", "/cloaks/ps.ico");
                break;
            }
            case "reset": {
                await defaultStore.setVal(SettingsVals.tab.cloak, "default");
                window.location.reload();
            }
            default: {
                return;
            }
        }
    }
}

const proxy = {
    searchEngine: async (s: string) => {
        await defaultStore.setVal(SettingsVals.proxy.searchEngine, s);
    },
    wisp: async (s: string) => {
        await defaultStore.setVal(SettingsVals.proxy.wispServer, s);
    },
    transport: async (t: "libcurl" | "epoxy") => {
        await defaultStore.setVal(SettingsVals.proxy.transport.key, t);
    }
}

async function* initDefaults() {
    const engine = await defaultStore.getVal(SettingsVals.proxy.searchEngine);
    yield proxy.searchEngine(engine || "ddg");
    yield proxy.wisp(preferredWispServer(await defaultStore.getVal(SettingsVals.proxy.wispServer)));
    const transport = await defaultStore.getVal(SettingsVals.proxy.transport.key);
    yield proxy.transport(transport ? transport as "libcurl" | "epoxy" : "libcurl");
}

const Settings = {
    tab,
    proxy,
    initDefaults
}

export { Settings };
