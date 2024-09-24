import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
//import { isIOS } from "./IosDetector";

declare global {
  interface Window {
    setTransport: () => void;
    connection: BareMuxConnection
  }
}

async function changeTransport(transport: string, wispUrl: string) {
  switch (transport) {
    case "epoxy":
      localStorage.setItem("transport", "epoxy");
      console.log("Setting transport to Epoxy");
      await window.connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
      break;
    case "libcurl":
      localStorage.setItem("transport", "libcurl");
      console.log("Setting transport to Libcurl");
      await window.connection.setTransport("/libcurl/index.mjs", [
        {
          wisp: wispUrl
        }
      ]);
      break;
    case "bare":
      localStorage.setItem("transport", "bare");
      console.log("Setting transport to Bare");
      const bare =
        localStorage.getItem("bare") || window.location.origin + "/bare/";
      console.log("Bare URL: " + bare);
      await window.connection.setTransport("/baremod/index.mjs", [bare]);
      break;
    default:
      await window.connection.setTransport("/libcurl/index.mjs", [
        {
          wisp: wispUrl
        }
      ]);
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
window.connection = new BareMuxConnection("/baremux/worker.js");

// helper function for  ../routes.tsx
async function setTransport() {
  await changeTransport(
    localStorage.getItem("transport") || "epoxy",
    localStorage.getItem("wispUrl") || wispUrl
  );
}

window.setTransport = setTransport;

export { changeTransport, getTransport, setTransport };
