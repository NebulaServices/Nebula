import { RammerheadEncode } from "../util/RammerheadEncode";
import { searchUtil } from "../util/searchUtil";
import { useEffect, useState } from "preact/hooks";
//import our Iframe component
import { Iframe } from "../components/iframe/Iframe";
import CloakedHead from "../util/CloakedHead";
import SiteSupport from "../util/SiteSupport.json";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}

export function ProxyFrame(props: { url: string }) {
  const { t } = useTranslation();
  // pass the URL encoded with encodeURIcomponent
  const localProxy = localStorage.getItem("proxy") || "automatic";
  const proxyMode = localStorage.getItem("proxyMode") || "embed";

  const [ProxiedUrl, setProxiedUrl] = useState<string | undefined>(undefined);

  let decodedUrl = decodeURIComponent(props.url);
  //attempt to convert to a valid url
  decodedUrl = searchUtil(decodedUrl, "https://google.com/search?q=%s");

  let proxyRef;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result: any = "";
        if (localProxy === "rammerhead") {
          result = await RammerheadEncode(decodedUrl);
        } else if (localProxy === "ultraviolet") {
          result =
            window.__uv$config.prefix +
            window.__uv$config.encodeUrl(decodedUrl);
        } else if (localProxy === "dynamic") {
          result =
            window.__dynamic$config.prefix + encodeURIComponent(decodedUrl);
        } else {
          // automatic. use SiteSupport.json to determine proxy support
          const matchingKey = Object.keys(SiteSupport).find((key) =>
            decodedUrl.includes(key)
          );

          if (SiteSupport[matchingKey] === "ultraviolet") {
            result =
              window.__uv$config.prefix +
              window.__uv$config.encodeUrl(decodedUrl);
          } else if (SiteSupport[matchingKey] === "dynamic") {
            result =
              window.__dynamic$config.prefix + encodeURIComponent(decodedUrl);
          } else if (SiteSupport[matchingKey] === "rammerhead") {
            result = await RammerheadEncode(decodedUrl);
          } else {
            result =
              window.__uv$config.prefix +
              window.__uv$config.encodeUrl(decodedUrl); // uv as backup
          }
        }
        setProxiedUrl(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [localProxy, decodedUrl]);

  if (proxyMode == "direct") {
    console.log(ProxiedUrl);
    console.log(!(ProxiedUrl == undefined));
    if (!(ProxiedUrl == undefined)) {
      window.location.href = ProxiedUrl; // This is the hackiest workaround in the history of hacky workarounds
    }
  } else if (proxyMode == "aboutblank") {
    const newWindow = window.open("about:blank", "_blank");
    const newDocument = newWindow.document.open();
    newDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style type="text/css">
            body, html
            {
              margin: 0; padding: 0; height: 100%; overflow: hidden;
            }
          </style>
        </head>
        <body>
          <iframe style="border: none; width: 100%; height: 100vh;" src="${
            window.location.origin + ProxiedUrl
          }"></iframe>
        </body>
      </html>
    `);
    newDocument.close();
    window.location.replace("/");
  }
  if (!ProxiedUrl == undefined) {
    window.location.href = ProxiedUrl;
  }
    
  return (
    <div class="h-screen w-screen bg-primary">
      <CloakedHead
        originalTitle={t("titles.home")}
        originalFavicon="/logo.png"
      />
      {proxyMode === "direct" && <h1>Loading {localProxy}...</h1>}
      {proxyMode === "aboutblank" && <h1>Loading {localProxy}...</h1>}
      {proxyMode === "embed" && <Iframe url={ProxiedUrl} />}
    </div>
  );
}
