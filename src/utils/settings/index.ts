//Combine all of the other settings into one object. And export that (along with types and other things)
import { AppearanceSettings, marketPlaceSettings } from "./marketplace";
import { TabSettings, tabSettings, cloak } from "./tab";
import { ProxySettings, proxySettings } from "./proxy";
import { type TabCloaks, type AbCloaks, type OpenIn, type Proxy, type Transport, type PackageType, type Package, SearchEngines, type SearchEngine, WispServerURLS, wispUrl } from "./types";

const Settings = {
  AppearanceSettings,
  TabSettings,
  ProxySettings
};

const settings = {
    marketPlaceSettings,
    tabSettings,
    proxySettings
}

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
}
