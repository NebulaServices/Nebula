import { LocationProvider, Router, Route } from "preact-iso";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404";
import { DiscordPage } from "./pages/discord";
import { ProxyFrame } from "./pages/ProxyFrame.js";
import { Radon } from "./pages/Radon";
import { Settings } from "./pages/Settings/";
import { AboutBlank } from "./AboutBlank";
import { Faq } from "./pages/Faq";

import "./style.css";
import "./i18n";
import { setTransport } from "./util/transports";
import { useEffect, useState } from "preact/hooks";
import { LoadSuspense } from "./LoadSuspense";
export default function Routes() {
  const [swRegistered, setSwRegistered] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/~/"
        })
        .then(() => {
          console.log("Service Worker Registered");
          setSwRegistered(true);
        })
        .catch((err) => {
          console.error("Service Worker Failed to Register", err);
        });
    }
  }, []);
  useEffect(() => {
    try {
      if (!swRegistered) return;
      setTransport();
    } catch (e) {
      console.error(e);
    }
  }, [swRegistered]);
  return swRegistered ? (
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
  ) : (
    <LoadSuspense />
  );
}
