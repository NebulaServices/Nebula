import { LocationProvider, Router, Route } from "preact-iso";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";
import { DiscordPage } from "./pages/discord.jsx";
import { ProxyFrame } from "./pages/ProxyFrame.js";
import { Settings } from "./pages/Settings/index.js";

import "./style.css";
import "./themes/main.css";
import "./i18n";

export default function Routes() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/discord" component={DiscordPage} />
        <Route path="/go/:url" component={ProxyFrame} />
        <Route path="/settings" component={Settings} />
        <Route default component={NotFound} />
      </Router>
    </LocationProvider>
  );
}

