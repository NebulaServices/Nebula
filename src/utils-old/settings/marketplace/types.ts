//Where all of our types live. Expect to see these exported and used in other files tons.
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

interface Package {
    theme?: {
        payload: string;
        video?: string;
        bgImage?: string;
    };
    plugin?: Plug;
}

export {
    type PluginType,
    type MarketplacePluginType,
    type PackageType,
    type Plug as Plugin,
    type SWPagePlugin,
    type SWPlugin,
    type Package,
    type SWPluginFunction
};
