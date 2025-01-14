import { Elements, log } from "./index";
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

/**
    * A class where for all of the Marketplace handlers.
    * It creates it's own StoreManager where all of it's values will live.
    * And it has 2 static items. instances and getInstances.
    *
    * @example
    * //Create a new Marketplace instance
    * const mp = new Marketplace();
    * //Use one of the very many methods available.
    * 
    * //Get all instances of a Marketplace is as easy as:
    * // const mp = Marketplace.getInstances.next().value;
    * // Consume and use the class.
*/
class Marketplace {
    //create our own subsidized StoreManager with it's own prefix so the marketplace stuff NEVER touches the other data
    #storage: StoreManager<"nebula||marketplace">;
    static #instances = new Set();
    constructor() {
        this.#storage = new StoreManager("nebula||marketplace");
        log({ type: 'info', bg: true, prefix: true }, 'Marketplace instance created and ready!');
        Marketplace.#instances.add(this);
    }
    
    /**
        * A static method to aquire an instance of a marketplace object.
        *
        * @example
        * //Get the first insatnce available. 
        * const mp = Marketplace.getInstances.next().value
        *
        * @example
        * // Iterate over every instance
        * for (const instance of Marketplace.getInstances()) {
            * // Do some work
        * }
    */
    static *getInstances() {
        //Marketplace.instances.forEach((val) => yield val);
        for (const item of Marketplace.#instances.keys()) {
            yield item! as Marketplace;
        }
    }

    /**
        * Detect if our Marketplace is ready or not. If it's not, don't resolve until it IS
    */
    static ready(): Promise<boolean> { 
        return new Promise((resolve) => {
            const t = setInterval(() => {
                if (Marketplace.#instances.size !== 0) {
                    clearInterval(t);
                    resolve(true);
                }
            }, 100);
        });
    }

    async getValueFromStore(val: string): Promise<string> {
        return this.#storage.getVal(val);
    }


    async getThemes(name?: string): Promise<{themes: any, theme: string, exists: Boolean}> {
        const themes = JSON.parse(this.#storage.getVal(SettingsVals.marketPlace.themes)) || [];
        const theme = themes.find((t: any) => t === name);
        const exists = themes.indexOf(name) !== -1;
        return { themes, theme, exists };
    } 

    async getPlugins(pname?: string): Promise<{plugins: any, plug: any}> {
        const plugins = JSON.parse(this.#storage.getVal(SettingsVals.marketPlace.plugins)) || [];
        const plug = plugins.find(({ name } : { name: string }) => name === pname );
        return { plugins, plug }
    }
    
    /**
        * Install a theme into both localstorage AND set the theme.
        *
        * @example
        * const mp = new Marketplace() // OR get an instances from getInstances()
        * mp.installTheme({
            * name: "testTheme",
            * payload: "/packages/testTheme/index.css",
            * // video: if you have a bg video, pass it here.
            * //bgImage: pass the BG image here if you have one
        * });
    */
    async installTheme(theme: Omit<Theme, "payload">) {
        const { themes, exists } = await this.getThemes(theme.name);
        if (exists) return log({ type: 'error', bg: false, prefix: false, throw: true }, `${theme.name} is already installed!`)
        themes.push(theme.name);
        this.#storage.setVal(SettingsVals.marketPlace.themes, JSON.stringify(themes));
    }

    async installPlugin(plugin: Plug) {
        let { plugins, plug } = await this.getPlugins(plugin.name);
        if (plug && plug.remove) { plug.remove = false; console.log(plug); return this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(plugins)) };
        plugins.push({ name: plugin.name, src: plugin.src, type: plugin.type } as unknown as Plug);
        this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(plugins));
    }

    async uninstallTheme(theme: Omit<Theme, "payload" | "video" | "bgImage">) {
        const { themes: items, exists } = await this.getThemes(theme.name);
        if (!exists) return log({ type: 'error', bg: false, prefix: false, throw: true }, `Theme: ${theme.name} is not installed!`);
        const idx = items.indexOf(theme.name);
        items.splice(idx, 1);
        this.#storage.setVal(SettingsVals.marketPlace.themes, JSON.stringify(items));
    }

    async uninstallPlugin(plug: Omit<Plug, "src">) {
        let { plugins: items, plug: plugin } = await this.getPlugins(plug.name);

        if (!plugin) return log({ type: 'error', bg: false, prefix: false, throw: true }, `Plugin: ${plug.name} is not installed!`);
        plugin.remove = true;
        this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(items));
    }

    async handlePlugins(worker: ServiceWorkerRegistration) {
        let { plugins } = await this.getPlugins();

        const pagePlugins: SWPagePlugin[] = [];
        const swPlugins: SWPlugin[] = [];
        if (plugins.length === 0) return log({ type: 'info', bg: false, prefix: true }, 'No plugins to add! Exiting.');
        plugins.map(async (plugin: Plug) => {
            if (plugin.type === "page") {
                const script = await fetch(`/packages/${plugin.name}/${plugin.src}`);
                const scriptRes = await script.text();
                console.log(scriptRes);
                const evaledScript = eval(scriptRes);
                console.log(evaledScript);
                const inject = (await evaledScript()) as unknown as SWPagePlugin;
                if (!plugin.remove) {
                    pagePlugins.push({
                        host: inject.host,
                        html: inject.html,
                        injectTo: inject.injectTo,
                        type: 'page'
                    });
                }
                else {
                    plugins = plugins.filter(({ name }: { name: string }) => name !== plugin.name);
                    pagePlugins.push({
                        remove: true,
                        host: inject.host,
                        html: inject.html,
                        injectTo: inject.injectTo,
                        type: 'page'
                    });
                }
                worker.active?.postMessage(pagePlugins);
            }
            
            if (plugin.type === "serviceWorker") {
                const s = await fetch(`/packages/${plugin.name}/${plugin.src}`);
                const sRes = await s.text();
                const eScript = eval(sRes);
                const inject = (await eScript()) as unknown as SWPlugin;
                if (!plugin.remove) {
                    swPlugins.push({
                        function: inject.function.toString(),
                        name: plugin.name,
                        events: inject.events,
                        type: 'serviceWorker'
                    });
                }
                else {
                    plugins = plugins.filter(({ name }: { name: string }) => name !== plugin.name);
                    swPlugins.push({
                        remove: true,
                        function: inject.function.toString(),
                        name: plugin.name,
                        events: inject.events,
                        type: 'serviceWorker'
                    });
                }
                worker.active?.postMessage(swPlugins);
            }
            this.#storage.setVal(SettingsVals.marketPlace.plugins, JSON.stringify(plugins));
        });
    }
    
    async theme(opts: { type: 'normal', payload: string, sources?: { video?: string, bg?: string }, name: string } | { type: 'remove', payload?: string, sources?: { video?: string, bg?: string }, name?: string }) {
        const elems = Elements.select([
            { type: 'id', val: 'stylesheet' },
            { type: 'id', val: 'nebulaVideo' },
            { type: 'id', val: 'nebulaImage' }
        ]);
        const s = Elements.exists<HTMLLinkElement>(await elems.next());
        const nv = Elements.exists<HTMLVideoElement>(await elems.next());
        const ni = Elements.exists<HTMLImageElement>(await elems.next());
        
        const nvl = this.#storage.getVal(SettingsVals.marketPlace.appearance.video);
        const nil = this.#storage.getVal(SettingsVals.marketPlace.appearance.image);
        const tsp = this.#storage.getVal(SettingsVals.marketPlace.appearance.theme.payload);
        const tsn = this.#storage.getVal(SettingsVals.marketPlace.appearance.theme.name);
        
        const reset = (style: boolean) => {
            const st = this.#storage;
            if (style) {
                st.removeVal(SettingsVals.marketPlace.appearance.theme.name);
                st.removeVal(SettingsVals.marketPlace.appearance.theme.payload);
                s.href = "/nebula.css";
            }
            st.removeVal(SettingsVals.marketPlace.appearance.video);
            nv.src = "";
            st.removeVal(SettingsVals.marketPlace.appearance.image);
            ni.style.display = "none";
            ni.src = "";
        }

        if (opts.type === 'remove') return reset(true);
        
        if (opts.sources?.video || nvl) {
            reset(false);
            if (!nvl) this.#storage.setVal(SettingsVals.marketPlace.appearance.video, opts.sources?.video || nvl);
            nv.src = `/packages/${opts.name}/${opts.sources?.video ? opts.sources.video : nvl}`
        }
        if (opts.sources?.bg || nil) {
            reset(false);
            if (!nil) this.#storage.setVal(SettingsVals.marketPlace.appearance.image, opts.sources?.bg || nil);
            ni.style.display = "block";
            ni.src = `/packages/${opts.name}/${opts.sources?.bg ? opts.sources.bg : nil}`
        }

        if (opts.payload) {
           if (tsp !== opts.payload) {
               this.#storage.setVal(SettingsVals.marketPlace.appearance.theme.payload, opts.payload);
               this.#storage.setVal(SettingsVals.marketPlace.appearance.theme.name, opts.name);
           }
           s.href = `/packages/${opts.name}/${opts.payload}`;
        }
        else {
            if (tsp) return s.href = `/packages/${tsn}/${tsp}`;
        }
    }
}

export { 
    Marketplace,
    type PluginType,
    type MarketplacePluginType,
    type PackageType,
    type Plug, 
    type SWPagePlugin,
    type SWPluginFunction,
    type Events,
    type SWPlugin,
    type Theme
}
