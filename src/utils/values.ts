import { defaultStore } from "./storage"

type cloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool";

// Where all of our values like Search Engines, WispServers
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

export { SearchEngines, WispServers, type cloaks }
