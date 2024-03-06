import { SetTransport, registerRemoteListener } from "@mercuryworkshop/bare-mux";


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
        default:
            SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
            break;
    }
}

const wispUrl = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
registerRemoteListener(navigator.serviceWorker.controller!);
changeTransport(localStorage.getItem("transport") || "epoxy", localStorage.getItem("wispUrl") || wispUrl);

export { changeTransport };
