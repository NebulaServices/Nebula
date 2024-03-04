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

registerRemoteListener(navigator.serviceWorker.controller!);
const p = changeTransport("epoxy", "ws://localhost:5173/wisp/");
window.p = p;
export { changeTransport };
