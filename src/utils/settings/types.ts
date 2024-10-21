const wispUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
type TabCloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool";
type AbCloaks = "a:b" | "blob";
type OpenIn = "a:b" | "blob" | "direct" | "embed";
type Proxy = "automatic" | "uv" | "rh";
type Transport = "epoxy" | "libcurl";
type PackageType = "theme" | "plugin";
const SearchEngines: Record<string, string> = {
    ddg: "https://duckduckgo.com/?q=%s",
    google: "https://google.com/search?q=%s",
    bing: "https://bing.com/search?q=%s"
};
type SearchEngine = "ddg" | "google" | "bing";
const WispServerURLS: Record<string, string> = {
    default: wispUrl,
    ruby: "wss://ruby.rubynetwork.co/wisp/"
};

type PluginType = "page" | "serviceWorker"
interface Plugin {
    name: string;
    src: string;
    type: PluginType;
    entryFunc: () => unknown | unknown;
}
interface SWPlugin {
    host: string;
    html: string;
    injectTo: "head" | "body";
}
interface Package {
    theme?: {
        payload: string;
        video?: string;
        bgImage?: string;
    };
    plugin?: Plugin;
}

export {
    type TabCloaks,
    type AbCloaks,
    type OpenIn,
    type Proxy,
    type Transport,
    type PackageType,
    type Package,
    type PluginType,
    type Plugin,
    type SWPlugin,
    SearchEngines,
    type SearchEngine,
    WispServerURLS,
    wispUrl
};
