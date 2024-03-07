import {
  SetTransport,
  registerRemoteListener
} from "@mercuryworkshop/bare-mux";

declare global {
  interface Window {
    BareMux: any;
    p: any;
  }
}

function changeTransport(transport: string, wispUrl: string) {
  switch (transport) {
    case "epoxy":
      localStorage.setItem("transport", "epoxy");
      SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
      break;
    //libcurl when supported can be easily added here
    //and stuff like bare-as-module3 COULD also be added
    default:
      SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
      break;
  }
}

function getTransport() {
  return localStorage.getItem("transport") || "epoxy";
}

function restartTransport() {
  changeTransport(
    getTransport(),
    localStorage.getItem("wispUrl") ||
      (location.protocol === "https:" ? "wss://" : "ws://") +
        location.host +
        "/wisp/"
  );
}

//restart transport every minute
setInterval(restartTransport, 60000); //60000ms = 60s = 1m

const wispUrl =
  (location.protocol === "https:" ? "wss://" : "ws://") +
  location.host +
  "/wisp/";
registerRemoteListener(navigator.serviceWorker.controller!);
changeTransport(
  localStorage.getItem("transport") || "epoxy",
  localStorage.getItem("wispUrl") || wispUrl
);

export { changeTransport, getTransport };
