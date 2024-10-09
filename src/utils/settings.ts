const wispUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
const TabSettings = {
  tabCloak: "nebula||tabCloak",
  abblob: "nebula||abBlob"
};
const ProxySettings = {
  proxy: "nebula||proxy",
  openIn: "nebula||open",
  searchEngine: "nebula||searchEngine",
  wispServerURL: "nebula||wisp",
  transport: "nebula||transport"
};
const Settings = {
  TabSettings,
  ProxySettings
};

type TabCloaks = "default" | "google" | "wikipedia" | "canvas" | "classroom" | "powerschool";
type AbCloaks = "a:b" | "blob";
type OpenIn = "a:b" | "blob" | "direct" | "embed";
type Proxy = "automatic" | "uv" | "rh";
type Transport = "epoxy" | "libcurl";
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

function cloak(cloak: AbCloaks | string, redirect: string, url: string) {
  switch (cloak) {
    case "a:b":
      window.location.replace(redirect);
      const win = window.open();
      win!.document.body.style.margin = "0";
      win!.document.body.style.height = "100vh";
      const iframe = win!.document.createElement("iframe");
      iframe.style.border = "none";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.margin = "0";
      iframe.src = url;
      win!.document.body.appendChild(iframe);
      break;
    case "blob":
      const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                <style type="text/css">
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                </style>
                </head>
                <body>
                <iframe style="border: none; width: 100%; height: 100vh;" src="${window.location.href}"></iframe>
                </body>
                </html>
            `;
      window.location.replace("https://google.com");
      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, "_blank");
      break;
  }
}

const tabSettings = {
  cloakTab: function (cloak: TabCloaks | string) {
    const faviconElement = document.getElementById("favicon") as HTMLLinkElement;
    localStorage.setItem(Settings.TabSettings.tabCloak, cloak);
    switch (cloak) {
      case "google":
        document.title = "Google";
        faviconElement.href = "/cloaks/google.png";
        break;
      case "wikipedia":
        document.title = "Wikipedia";
        faviconElement.href = "/cloaks/wikipedia.ico";
        break;
      case "canvas":
        document.title = "Dashboard";
        faviconElement.href = "/cloaks/canvas.ico";
        break;
      case "classroom":
        document.title = "Home";
        faviconElement.href = "/cloaks/classroom.png";
        break;
      case "powerschool":
        document.title = "PowerSchool";
        faviconElement.href = "/cloaks/ps.ico";
        break;
      case "reset":
        //force a reset of favicon & title
        localStorage.setItem("nebula||tabCloak", "default");
        window.location.reload();
      default:
        return;
    }
  },
  abCloak: function (type: AbCloaks | string) {
    localStorage.setItem(Settings.TabSettings.abblob, type);
    cloak(type as AbCloaks, "https://google.com", window.location.href);
  }
};

const proxySettings = {
  changeProxy: function (proxy: Proxy | string) {
    localStorage.setItem(Settings.ProxySettings.proxy, proxy);
  },
  openIn: function (type: OpenIn | string) {
    localStorage.setItem(Settings.ProxySettings.openIn, type);
  },
  setSearchEngine: function (searchEngine: SearchEngine | string) {
    localStorage.setItem(Settings.ProxySettings.searchEngine, searchEngine);
  },
  setWispURL: function (server: string) {
    localStorage.setItem(Settings.ProxySettings.wispServerURL, server);
  },
  setTransport: function (transport: Transport | string) {
    localStorage.setItem(Settings.ProxySettings.transport, transport);
  }
};

export { tabSettings, proxySettings, Settings, WispServerURLS, SearchEngines, cloak, type Proxy };
