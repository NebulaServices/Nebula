import {
  SetTransport,
  registerRemoteListener
} from "@mercuryworkshop/bare-mux";

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
        wisp: wispUrl,
        wasm: "https://cdn.jsdelivr.net/npm/libcurl.js@v0.5.2/libcurl.wasm"
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
        wisp: wispUrl,
        wasm: "/libcurl.wasm"
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


changeTransport(
  localStorage.getItem("transport") || "libcurl",
  localStorage.getItem("wispUrl") || wispUrl
);

export { changeTransport, getTransport };
