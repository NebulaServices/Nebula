import { RammerheadEncode } from "./RammerheadEncode";
import { useEffect, useState } from "preact/hooks";

declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}

export function ProxyFrame(props: { url: string }) {
  // pass the URL encoded with encodeURIcomponent
  var localProxy = localStorage.getItem("proxy") || "automatic";
  var [ProxiedUrl, setProxiedUrl] = useState<string | undefined>(undefined);

  var decodedUrl = decodeURIComponent(props.url);

  if (!decodedUrl.includes(".")) {
    decodedUrl = "https://www.google.com/search?q=" + decodedUrl; // If the users input has no . then we change it to a google query. TODO: Feature to change search engines
  }
  if (decodedUrl.startsWith("http://") || !decodedUrl.startsWith("https://")) {
    decodedUrl = "https://" + decodedUrl;
  }

  useEffect(() => {
    // For now we can redirect to the results. In the future we will add an if statement looking for the users proxy display choice
    if (localProxy === "rammerhead") {
      RammerheadEncode(decodedUrl).then((result: string) => {
        setProxiedUrl(result);
        window.location.href = result;
      });
    } else if (localProxy === "ultraviolet") {
      window.location.href =
        window.__uv$config.prefix + window.__uv$config.encodeUrl(decodedUrl);
    } else if (localProxy === "dynamic") {
      window.location.href =
        window.__dynamic$config.prefix + encodeURIComponent(decodedUrl);
    } else {
      // use UV for automatic
      window.location.href =
        window.__uv$config.prefix + window.__uv$config.encodeUrl(decodedUrl);
    }
  }, [localProxy]);

  console.log(ProxiedUrl);

  return (
    <div>
      <h1 className="text-black">{props.url}</h1>
      <h1 className="text-black">{localProxy}</h1>
      <h1 className="text-black">{ProxiedUrl}</h1>
    </div>
  ); // @TODO: Routing (iframe, ab, direct, etc.)
}
