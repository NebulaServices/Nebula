//marketplace code & handlers
import { Settings } from "../index";
import {
    type Package,
    type PackageType,
    type Plugin,
    type PluginType,
    type SWPagePlugin,
    type SWPlugin
} from "../types";
const AppearanceSettings = {
    themes: "nebula||themes",
    themeName: "nebula||themeName",
    stylePayload: "nebula||stylepayload",
    video: "nebula||video",
    image: "nebula||image"
};

const PluginSettings = {
    plugins: "nebula||plugins"
};

const MarketPlaceExtras = {
    proxy: "nebula||marketplaceProxy",
    hostname: "nebula||marketplaceHostname"
};

const marketPlaceSettings = {
    install: function (p: Package, packageName: string, payload?: any) {
        return new Promise<void>((resolve) => {
            if (p.theme) {
                let themes = localStorage.getItem(AppearanceSettings.themes) as any;
                themes ? (themes = JSON.parse(themes)) : (themes = []);
                if (!themes.find((theme: any) => theme === packageName)) {
                    themes.push(packageName);
                    localStorage.setItem(AppearanceSettings.themes, JSON.stringify(themes));
                    this.changeTheme(false, payload, p.theme.video, p.theme.bgImage, packageName);
                }
                resolve();
            }
            if (p.plugin) {
                let plugins = localStorage.getItem(PluginSettings.plugins) as any;
                plugins ? (plugins = JSON.parse(plugins)) : (plugins = []);
                //@ts-ignore
                const plugin = plugins.find(({ name }) => name === packageName) as Plugin;
                if (!plugin) {
                    plugins.push({
                        name: packageName,
                        src: p.plugin.src,
                        type: p.plugin.type
                    } as unknown as Plugin);
                    localStorage.setItem(PluginSettings.plugins, JSON.stringify(plugins));
                } else if (plugin && plugin.remove) {
                    plugin.remove = false;
                    localStorage.setItem(Settings.PluginSettings.plugins, JSON.stringify(plugins));
                }
                resolve();
            }
        });
    },
    uninstall: function (p: PackageType, packageName: string) {
        console.log(p);
        return new Promise<void>((resolve) => {
            if (p === "theme") {
                let items = localStorage.getItem(AppearanceSettings.themes) as any;
                items ? (items = JSON.parse(items)) : (items = []);
                if (items.find((theme: any) => theme === packageName.toLowerCase())) {
                    const idx = items.indexOf(packageName.toLowerCase());
                    items.splice(idx, 1);
                    localStorage.setItem(AppearanceSettings.themes, JSON.stringify(items));
                    this.changeTheme(true);
                }
                resolve();
            }
            if (p === "plugin-page" || p === "plugin-sw") {
                let plugins = localStorage.getItem(PluginSettings.plugins) as any;
                plugins ? (plugins = JSON.parse(plugins)) : (plugins = []);
                //@ts-ignore
                const plugin = plugins.find(({ name }) => name === packageName.toLowerCase());
                if (plugin) {
                    plugin.remove = true;
                    localStorage.setItem(PluginSettings.plugins, JSON.stringify(plugins));
                }
                resolve();
            }
        });
    },
    handlePlugins: function (worker: never | ServiceWorkerRegistration) {
        return new Promise<void>((resolve) => {
            let plugins =
                JSON.parse(localStorage.getItem(Settings.PluginSettings.plugins) as string) || [];
            const swPagePlugins: SWPagePlugin[] = [];
            const swPlugins: SWPlugin[] = [];
            if (plugins.length === 0) {
                console.log("Plugin length is not greater then 0. Resolving.");
                return resolve();
            }
            plugins.forEach(async (plugin: Plugin) => {
                if (plugin.type === "page") {
                    const pluginScript = await fetch(
                        `/packages/${plugin.name.toLowerCase()}/${plugin.src}`
                    ).then((res) => res.text());
                    const script = eval(pluginScript);
                    const inject = (await script()) as unknown as SWPagePlugin;
                    if (plugin.remove) {
                        plugins = plugins.filter(
                            //@ts-ignore freaking types BRO
                            ({ name }) => name !== plugin.name.toLowerCase()
                        );
                        swPagePlugins.push({
                            remove: true,
                            host: inject.host,
                            html: inject.html,
                            injectTo: inject.injectTo,
                            type: "page"
                        });
                    } else {
                        swPagePlugins.push({
                            host: inject.host,
                            html: inject.html,
                            injectTo: inject.injectTo,
                            type: "page"
                        });
                    }
                    //only resolve AFTER we have postMessaged to the SW.
                    worker.active?.postMessage(swPagePlugins);
                } else if (plugin.type === "serviceWorker") {
                    const pluginScript = await fetch(
                        `/packages/${plugin.name.toLowerCase()}/${plugin.src}`
                    ).then((res) => res.text());
                    const script = eval(pluginScript);
                    const inject = (await script()) as unknown as SWPlugin;
                    if (plugin.remove) {
                        plugins = plugins.filter(
                            //@ts-ignore
                            ({ name }) => name !== plugin.name.toLowerCase()
                        );
                        swPlugins.push({
                            remove: true,
                            function: inject.function.toString(),
                            name: plugin.name,
                            events: inject.events,
                            type: "serviceWorker"
                        });
                    } else {
                        swPlugins.push({
                            function: inject.function.toString(),
                            name: plugin.name,
                            events: inject.events,
                            type: "serviceWorker"
                        });
                    }
                    worker.active?.postMessage(swPlugins);
                }
                localStorage.setItem(Settings.PluginSettings.plugins, JSON.stringify(plugins));
                resolve();
            });
        });
    },
    changeTheme: async function (
        reset: Boolean,
        payload?: any,
        videoSource?: string,
        bgSource?: string,
        name?: string
    ) {
        async function resetCSS() {
            const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
            localStorage.removeItem(AppearanceSettings.stylePayload);
            localStorage.removeItem(AppearanceSettings.themeName);
            stylesheet.href = "/nebula.css";
        }
        function resetVideo() {
            localStorage.removeItem(AppearanceSettings.video);
            const source = document.getElementById("nebulaVideo")! as HTMLVideoElement;
            source.src = "";
        }
        function resetBGImage() {
            localStorage.removeItem(AppearanceSettings.image);
            const image = document.getElementById("nebulaImage")! as HTMLImageElement;
            image.style.display = "none";
            image.src = "";
        }
        if (reset === true) {
            await resetCSS();
            resetBGImage();
            resetVideo();
        }
        if (videoSource || localStorage.getItem(AppearanceSettings.video)) {
            resetBGImage();
            resetVideo();
            const source = document.getElementById("nebulaVideo")! as HTMLVideoElement;
            if (!localStorage.getItem(AppearanceSettings.video)) {
                localStorage.setItem(AppearanceSettings.video, videoSource as string);
            }
            source.src = `/packages/${name}/${videoSource ? videoSource : localStorage.getItem(AppearanceSettings.video)}`;
        }
        if (bgSource || localStorage.getItem(AppearanceSettings.image)) {
            resetVideo();
            resetBGImage();
            const image = document.getElementById("nebulaImage")! as HTMLImageElement;
            if (!localStorage.getItem(AppearanceSettings.image)) {
                localStorage.setItem(AppearanceSettings.image, bgSource as string);
            }
            image.style.display = "block";
            image.src = `/packages/${name}/${bgSource ? bgSource : localStorage.getItem(AppearanceSettings.image)}`;
        }
        if (payload) {
            const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
            if (localStorage.getItem(AppearanceSettings.stylePayload) !== payload) {
                localStorage.setItem(AppearanceSettings.stylePayload, payload);
                localStorage.setItem(AppearanceSettings.themeName, name as string);
            }
            stylesheet.href = `/packages/${name}/${localStorage.getItem(AppearanceSettings.stylePayload)}`;
        } else {
            if (localStorage.getItem(AppearanceSettings.stylePayload)) {
                const stylesheet = document.getElementById("stylesheet")! as HTMLLinkElement;
                stylesheet.href = `/packages/${localStorage.getItem(AppearanceSettings.themeName)}/${localStorage.getItem(AppearanceSettings.stylePayload)}`;
            }
        }
    }
};

export { AppearanceSettings, PluginSettings, MarketPlaceExtras, marketPlaceSettings };
