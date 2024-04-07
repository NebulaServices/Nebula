import { LocationProvider, Router, Route } from "preact-iso";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404";
import { DiscordPage } from "./pages/discord";
import { ProxyFrame } from "./pages/ProxyFrame.js";
import { Radon } from "./pages/Radon";
import { Settings } from "./pages/Settings/";
import { AboutBlank } from "./AboutBlank";
import { Faq } from "./pages/Faq";
import { SetTransport } from "@mercuryworkshop/bare-mux";

import "./style.css";
import "./i18n";

export default function Routes() {
  const wispUrl =
    (location.protocol === "https:" ? "wss://" : "ws://") +
    location.host +
    "/wisp/"; // @TODO Japan - US ping

  if ("serviceWorker" in navigator) {
    console.log("am bout to bus");
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/~/"
      })
      .then(() => {
        console.log("Service Worker Registered");
        try {
          localStorage.setItem("transport", "libcurl");
          console.log("Setting transport to Libcurl");
          SetTransport("CurlMod.LibcurlClient", {
            wisp: wispUrl
          });
        } catch {}
      })
      .catch((err) => {
        console.error("Service Worker Failed to Register", err);
      });
  } else {
    alert("err");
  }
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/discord" component={DiscordPage} />
        <Route path="/games" component={Radon} />
        <Route path="/go/:url" component={ProxyFrame} />
        <Route path="/settings" component={Settings} />
        <Route path="/ab/:url" component={AboutBlank} />
        <Route path="/faq" component={Faq} />
        <Route default component={NotFound} />
      </Router>
    </LocationProvider>
  );
}
