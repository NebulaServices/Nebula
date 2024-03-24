import {
  SetTransport,
  registerRemoteListener
} from "@mercuryworkshop/bare-mux";
//import { isIOS } from "./IosDetector";

declare global {
  interface Window {
    setTransport: () => void;
  }
}

function changeTransport(transport: string, wispUrl: string) {
  switch (transport) {
    case "epoxy":
      localStorage.setItem("transport", "epoxy");
      console.log("Setting transport to Epoxy");
      SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
      break;
    case "libcurl":
      localStorage.setItem("transport", "libcurl");
      console.log("Setting transport to Libcurl");
      SetTransport("CurlMod.LibcurlClient", {
        wisp: wispUrl
      });
      break;
    case "bare":
      localStorage.setItem("transport", "bare");
      console.log("Setting transport to Bare");
      const bare =
        localStorage.getItem("bare") || window.location.origin + "/bare/";
      console.log("Bare URL: " + bare);
      SetTransport("BareMod.BareClient", bare);
      break;
    default:
      SetTransport("CurlMod.LibcurlClient", {
        wisp: wispUrl
      });
      break;
  }
}

function getTransport() {
  return localStorage.getItem("transport") || "epoxy";
}

const wispUrl =
  (location.protocol === "https:" ? "wss://" : "ws://") +
  location.host +
  "/wisp/";
registerRemoteListener(navigator.serviceWorker.controller!);

//if (isIOS) {
//  console.log("iOS device detected. Bare will be used.");
//  changeTransport(
//    localStorage.getItem("transport") || "libcurl",
//    localStorage.getItem("wispUrl") || wispUrl
//  );
//} else {
//  changeTransport(
//   localStorage.getItem("transport") || "bare",
//   localStorage.getItem("wispUrl") || wispUrl
//  );
//}

//changeTransport(
//    localStorage.getItem("transport") || "libcurl",
//    localStorage.getItem("wispUrl") || wispUrl
//);

// helper function for  ../routes.tsx
function setTransport() {
  changeTransport(
    localStorage.getItem("transport") || "libcurl",
    localStorage.getItem("wispUrl") || wispUrl
  );
}

window.setTransport = setTransport;

export { changeTransport, getTransport, setTransport };
