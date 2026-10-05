import { defaultStore } from "./storage"
import { STATIC_MARKETPLACE } from "astro:env/client";
import { chooseWispServer, resolveDefaultWisp } from "./wispDefault";

type cloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool";

// Where all of our values like Search Engines, WispServers & SupportedSites live.
const SearchEngines: Record<string, string> = {
    ddg: "https://duckduckgo.com/?q=%s",
    //google: "https://google.com/search?q=%s",
    bing: "https://bing.com/search?q=%s"
}

const WispServers: Record<string, string> = {
    "default": (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/"
}

async function getCustomWispUrl(): Promise<string | null> {
    return defaultStore.getVal("customWispUrl");
}

// ---------------------------------------------------------------------------
// Generatable wisp servers
//
// When the serving host has no `/wisp/` endpoint of its own (e.g. a static
// deploy), Nebula can generate a fresh, Cloudflare-fronted nightwisp endpoint
// client-side and validate it before use. Mirrors the generator used by the
// shoestring bootloader.
// ---------------------------------------------------------------------------
const WISP_GEN_DOMAINS: readonly string[] = ["nightwisp.me"];

function genWispServer(): string {
    const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(36))
        .join("")
        .substring(0, 32);
    const domain = WISP_GEN_DOMAINS[Math.floor(Math.random() * WISP_GEN_DOMAINS.length)];
    return `wss://${rand}.${domain}.cdn.cloudflare.net/wisp/`;
}

function wsPing(server: string, timeout = 5000): Promise<boolean> {
    return new Promise((resolve) => {
        let done = false;
        let ws: WebSocket | undefined;
        const finish = (ok: boolean) => {
            if (done) return;
            done = true;
            try { ws?.close(); } catch { /* noop */ }
            resolve(ok);
        };
        try {
            ws = new WebSocket(server);
        } catch {
            return resolve(false);
        }
        ws.addEventListener("open", () => finish(true));
        ws.addEventListener("message", () => finish(true));
        ws.addEventListener("error", () => finish(false));
        setTimeout(() => finish(false), timeout);
    });
}

// Try a few random generated endpoints, returning the first that connects.
async function resolveGeneratedWisp(attempts = 5): Promise<string> {
    for (let i = 0; i < attempts; i++) {
        const candidate = genWispServer();
        if (await wsPing(candidate)) return candidate;
    }
    throw new Error("[wisp] no live generated wisp server found");
}

// Resolve the wisp URL for a stored selection key
// ("default" | "custom" | "generated"). Async because "generated" validates a
// live endpoint before returning it.
async function resolveWispServer(key: string | null | undefined): Promise<string> {
    const selected = chooseWispServer(key, STATIC_MARKETPLACE);
    if (selected === "generated") return resolveGeneratedWisp();
    if (selected === "default") {
        return resolveDefaultWisp(WispServers.default, wsPing, resolveGeneratedWisp,
            (choice) => defaultStore.setVal(SettingsVals.proxy.wispServer, choice));
    }
    const value = selected === "custom" ? await getCustomWispUrl() : WispServers[selected];
    return value || WispServers.default;
}

function preferredWispServer(saved: string | null | undefined): string {
    return chooseWispServer(saved, STATIC_MARKETPLACE);
}

interface SettingsVals {
    i18n: {
        lang: "selectedLanguage",
        languages: {
            en: string,
            jp: string
        }
    },
    proxy: {
      searchEngine: string,
      wispServer: string,
        transport: {
            key: string,
            available: { 
                epoxy: string; 
                libcurl: string;
            }
        },
    },
    tab: {
        cloak: string;
        ab: string;
    },
    marketPlace: {
        themes: string;
        plugins: string;
        appearance: {
            video: string;
            image: string;
            theme: {
                payload: string;
                name: string;
            }
        }
    }
}
/**
    * This object allows us to access things such as the wisp server url and other things that aren't just one offs
*/
const SettingsVals: SettingsVals = {
    i18n: {
        lang: "selectedLanguage",
        languages: {
            en: "en_US",
            jp: "jp"
        }
    },
  proxy: {
      searchEngine: "searchEngine",
      wispServer: "wispServer",
        transport: {
            key: "transport",
            available: {
                epoxy: "epoxy",
                libcurl: "libcurl"
            }
        }
    },
    tab: {
        cloak: "cloak",
        ab: "aboutblank"
    },
    marketPlace: {
        themes: "themes",
        plugins: "plugins",
        appearance: {
            video: "video",
            image: "image",
            theme: {
                name: "themeName",
                payload: "themePayload"
            }
        }
    }
}

export { SearchEngines, WispServers, SettingsVals, genWispServer, resolveGeneratedWisp, resolveWispServer, preferredWispServer, getCustomWispUrl, type cloaks }
