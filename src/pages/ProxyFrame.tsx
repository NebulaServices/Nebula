import { RammerheadEncode } from "../util/RammerheadEncode";
import { searchUtil } from "../util/searchUtil";
import { useEffect, useState } from "preact/hooks";
//import our Iframe component
import { Iframe } from "../components/iframe/Iframe";

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}

export function ProxyFrame(props: { url: string }) {
  // pass the URL encoded with encodeURIcomponent
  const localProxy = localStorage.getItem("proxy") || "automatic";
  const proxyMode = localStorage.getItem("proxyMode") || "direct";

  const [ProxiedUrl, setProxiedUrl] = useState<string | undefined>(undefined);

  let decodedUrl = decodeURIComponent(props.url);
  //attempt to convert to a valid url
  decodedUrl = searchUtil(decodedUrl, "https://google.com/search?q=%s");

  let proxyRef;

  useEffect(() => {
    // For now we can redirect to the results. In the future we will add an if statement looking for the users proxy display choice
    if (localProxy === "rammerhead") {
      RammerheadEncode(decodedUrl).then((result: string) => {
        setProxiedUrl(result);
      });
    } else if (localProxy === "ultraviolet") {
      setProxiedUrl(
        window.__uv$config.prefix + window.__uv$config.encodeUrl(decodedUrl)
      );
    } else if (localProxy === "dynamic") {
      setProxiedUrl(
        window.__dynamic$config.prefix + encodeURIComponent(decodedUrl)
      );
    } else {
      // use UV for automatic
      setProxiedUrl(
        window.__uv$config.prefix + window.__uv$config.encodeUrl(decodedUrl)
      );
    }
  }, [localProxy]);

  if (proxyMode == "direct") {
    window.location.href = ProxiedUrl;
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

  return (
    <div class="h-screen w-screen bg-primary">
      {proxyMode === "direct" && <h1>Loading {localProxy}...</h1>}
      {proxyMode === "aboutblank" && <h1>Loading {localProxy}...</h1>}
      {proxyMode === "embed" && (
        <Iframe url={ProxiedUrl} normalUrl={decodedUrl} />
      )}
    </div>
  );
}
