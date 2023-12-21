import { RammerheadEncode } from "./RammerheadEncode";
import { useEffect, useState } from "preact/hooks";

export function ProxyFrame(props: { url: string }) { // pass the URL encoded with encodeURIcomponent
  var localProxy = localStorage.getItem("proxy") || "automatic";
  var [ProxiedUrl, setProxiedUrl] = useState<string | undefined>(undefined);

  var decodedUrl = decodeURIComponent(props.url);

  useEffect(() => {
    if (localProxy === "rammerhead") {
      RammerheadEncode(decodedUrl).then((result: string) => {
        console.log("ProxyHref inside:", result);
        setProxiedUrl(result);
      });
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
