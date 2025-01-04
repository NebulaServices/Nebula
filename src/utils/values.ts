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
    "youtu.be": "uv"
};

/**
    * This object allows us to access things such as the wisp server url and other things that aren't just one offs
*/
const SettingsVals = {
    proxy: {
        wispServer: "wispServerUrl",
        proxy: "proxy",
        searchEngine: "searchEngine",
        transport: "transport"
    },
    tab: {
        cloak: "cloak"
    },
    marketPlace: {
        appearance: {
            video: "video",
            image: "image",
            themeName: "themeName"
        }
    }
}

export { SearchEngines, WispServers, SupportedSites, SettingsVals, type cloaks }
