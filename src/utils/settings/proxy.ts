//Proxy specific settings.
import { type OpenIn, type Proxy, type SearchEngine, type Transport } from "./types";
const ProxySettings = {
    proxy: "nebula||proxy",
    openIn: "nebula||open",
    searchEngine: "nebula||searchEngine",
    wispServerURL: "nebula||wisp",
    transport: "nebula||transport"
};

const proxySettings = {
    changeProxy: function (proxy: Proxy | string) {
        localStorage.setItem(ProxySettings.proxy, proxy);
    },
    openIn: function (type: OpenIn | string) {
        localStorage.setItem(ProxySettings.openIn, type);
    },
    setSearchEngine: function (searchEngine: SearchEngine | string) {
        localStorage.setItem(ProxySettings.searchEngine, searchEngine);
    },
    setWispURL: function (server: string) {
        localStorage.setItem(ProxySettings.wispServerURL, server);
    },
    setTransport: function (transport: Transport | string) {
        localStorage.setItem(ProxySettings.transport, transport);
    }
};

export { ProxySettings, proxySettings };
