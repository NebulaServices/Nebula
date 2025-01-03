//Combine all of the other settings into one object. And export that (along with types and other things)
import {
    AppearanceSettings,
    MarketPlaceExtras,
    PluginSettings,
    marketPlaceSettings
} from "./marketplace/index";
import { ProxySettings, proxySettings } from "./proxy";
import { TabSettings, cloak, tabSettings } from "./tab";
import {
    type AbCloaks,
    type OpenIn,
    type Package,
    type PackageType,
    type Proxy,
    type SearchEngine,
    SearchEngines,
    type TabCloaks,
    type Transport,
    WispServerURLS,
    wispUrl
} from "./types";

const Settings = {
    AppearanceSettings,
    TabSettings,
    ProxySettings,
    MarketPlaceExtras,
    PluginSettings
};

const settings = {
    marketPlaceSettings,
    tabSettings,
    proxySettings
};

//export all of the stuffs
export {
    Settings,
    settings,
    SearchEngines,
    WispServerURLS,
    wispUrl,
    cloak,
    type TabCloaks,
    type AbCloaks,
    type OpenIn,
    type Proxy,
    type Transport,
    type PackageType,
    type Package,
    type SearchEngine
};
