import { log } from "./index";
import { StoreManager } from "./storage";
import { SettingsVals } from "./values";

type PluginType = "page" | "serviceWorker";
type MarketplacePluginType = "plugin-page" | "plugin-sw";
type PackageType = "theme" | MarketplacePluginType;

interface Plug {
    name: string;
    src: string;
    type: PluginType;
    remove?: boolean;
}
interface SWPagePlugin extends Omit<Plug, "name" | "src"> {
    host: string;
    html: string;
    injectTo: "head" | "body";
}

type SWPluginFunction<T extends unknown> = (args: T) => void | unknown;

type Events =
    | "abortpayment"
    | "activate"
    | "backgroundfetchabort"
    | "backgroundfetchclick"
    | "backgroundfetchfail"
    | "backgroundfetchsuccess"
    | "canmakepayment"
    | "contentdelete"
    | "cookiechange"
    | "fetch"
    | "install"
    | "message"
    | "messageerror"
    | "notificationclick"
    | "notificationclose"
    | "paymentrequest"
    | "periodicsync"
    | "push"
    | "pushsubscriptionchange"
    | "sync";

interface SWPlugin extends Omit<Plug, "src"> {
    function: string | SWPluginFunction<any>;
    events: Events[];
}

interface Theme {
    name: string;
    payload: string;
    video?: string;
    bgImage?: string;
};

class Marketplace {
    //create our own subsidized StoreManager with it's own prefix so the marketplace stuff NEVER touches the other data
    #storage: StoreManager<"nebula||marketplace">;
    constructor() {
        this.#storage = new StoreManager("nebula||marketplace");
    }
    async installTheme(theme: Theme) {
        const themes = this.#storage.getVal(SettingsVals.marketPlace.themes)
        ? JSON.parse(this.#storage.getVal(SettingsVals.marketPlace.themes))
        : [];
        if (themes.find((t: any) => t === theme.name)) return log({ type: 'error', bg: false, prefix: false, throw: true }, `${theme.name} is already installed!`)
        themes.push(theme.name);
        this.#storage.setVal(SettingsVals.marketPlace.themes, JSON.stringify(themes));
    }

    async installPlugin(plugin: Plug) {
        const plugins = this.#storage.getVal(SettingsVals.marketPlace.plugins)
        ? JSON.parse(this.#storage.getVal(SettingsVals.marketPlace.plugins))
        : [];

        const plug = plugins.find(({ name }: { name: string }) => name === plugin.name);
        if (plug && plug.remove === false) return log({ type: 'error', bg: false, prefix: false, throw: true }, `${plugin.name} is already installed!`);
        if (plug && plug.remove) { plug.remove = false; return this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(plugins)) };
        plugins.push({ name: plugin.name, src: plugin.src, type: plugin.type } as unknown as Plug);
        this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(plugins));
    }
}

window.mp = Marketplace

export { Marketplace }
