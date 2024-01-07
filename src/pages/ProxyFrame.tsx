import { RammerheadEncode } from "../util/RammerheadEncode";
import { searchUtil } from "../util/searchUtil";
import { LoadSuspense } from "../LoadSuspense";
import { useEffect, useState } from "preact/hooks";
//import our Iframe component
import { Iframe } from "../components/iframe/Iframe";
import CloakedHead from "../util/CloakedHead";
import SiteSupport from "../util/SiteSupport.json";
import { useTranslation } from "react-i18next";
import { dec } from "../aes";


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import TrackerList from "@mercuryworkshop/adrift/tracker-list";
import {
  SignalFirebase,
  AdriftBareClient,
  RTCTransport,
  Connection,
} from "@mercuryworkshop/adrift/client";
import {
  registerRemoteListener,
  setBareClientImplementation,
} from "@mercuryworkshop/bare-client-custom";

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
  const searchEngine =
    localStorage.getItem("searchEngine") || "https://duckduckgo.com/?q=%s";

  const [ProxiedUrl, setProxiedUrl] = useState<string | undefined>(undefined);
  //@ts-ignore
  let decodedUrl = dec(
    "U2FsdGVkX1" + decodeURIComponent(props.url),
    window.location.origin.slice(8) + navigator.userAgent
  );
  //attempt to convert to a valid url
  decodedUrl = searchUtil(decodedUrl, searchEngine);

  let proxyRef;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localProxy == "adrift") {
          registerRemoteListener();
          let tracker = TrackerList["us-central-1"];
          initializeApp(tracker.firebase);


          let rtctransport = new RTCTransport(async () => {
            let connection = new Connection(rtctransport);
            await connection.initialize();
            setBareClientImplementation(new AdriftBareClient(connection));
            setProxiedUrl(window.__uv$config.prefix + Ultraviolet.codec.xor.encode(decodedUrl));
          }, () =>
            console.log("transport closed")
          );


          console.log("offering");

          let offer = await rtctransport.createOffer();
          console.log("Routing you to an available node...");
          let answer = await SignalFirebase.signalSwarm(JSON.stringify(offer));
          console.log("Linking to node...");
          rtctransport.answer(answer.answer, answer.candidates);
          return;
        }

        let result: any = "";
        if (localProxy === "rammerhead") {
          result = await RammerheadEncode(decodedUrl);
        } else if (localProxy === "ultraviolet") {
          result =
            window.__uv$config.prefix +
            window.__uv$config.encodeUrl(decodedUrl);
        } else if (localProxy === "dynamic") {
          result =
            window.__dynamic$config.prefix +
            "route?url=" +
            encodeURIComponent(decodedUrl);
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
              window.__dynamic$config.prefix +
              "route?url=" +
              encodeURIComponent(decodedUrl);
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
    if (!(ProxiedUrl == undefined)) {
      window.location.href = "/ab/" + encodeURIComponent(ProxiedUrl);
    }
  }
  if (!ProxiedUrl == undefined) {
    window.location.href = ProxiedUrl;
  }

  if (proxyMode === "embed") {
    history.pushState({}, "", "/");
  }

  return (
    <div className="h-screen w-screen bg-primary">
      <CloakedHead
        originalTitle={t("titles.home")}
        originalFavicon="/logo.png"
      />
      {proxyMode === "direct" && <LoadSuspense />}
      {proxyMode === "aboutblank" && <LoadSuspense />}
      {proxyMode === "embed" && <Iframe url={ProxiedUrl} />}
    </div>
  );
}
