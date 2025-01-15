import { defaultStore } from "./storage"

type cloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool";

// Where all of our values like Search Engines, WispServers & SupportedSites live.
const SearchEngines: Record<string, string> = {
    ddg: "https://duckduckgo.com/?q=%s",
    google: "https://google.com/search?q=%s",
    bing: "https://bing.com/search?q=%s"
}

const WispServers: Record<string, string> = {
    "default": (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/",
    "ruby": "wss://ruby.rubynetwork.co/wisp/",
    "wisp.run": "wss://wisp.run/",
    "custom": defaultStore.getVal("customWispUrl")
}

const SupportedSites: Record<string, "uv" | "sj"> = {
    "discord.gg": "sj",
    "discord.com": "sj",
    "spotify.com": "sj",
    "spotify.link": "sj",
    "youtube.com": "uv",
    "youtu.be": "uv",
    "google.com": "uv"
};

interface SettingsVals {
    i18n: {
        lang: "selectedLanguage",
        languages: {
            en: string,
            jp: string
        }
    },
    proxy: {
        wispServer: string,
        proxy: {
            key: string,
            available: {
                uv: string;
                sj: string;
                automatic: string
            }
        },
        searchEngine: string,
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
        wispServer: "wispServer",
        proxy: { 
            key: "proxy",
            available: {
                sj: "sj",
                uv: "uv",
                automatic: "automatic"
            }
        },
        searchEngine: "searchEngine",
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

export { SearchEngines, WispServers, SupportedSites, SettingsVals, type cloaks }
