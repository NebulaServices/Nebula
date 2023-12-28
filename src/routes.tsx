import { LocationProvider, Router, Route } from "preact-iso";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";
import { DiscordPage } from "./pages/discord.jsx";
import { ProxyFrame } from "./pages/ProxyFrame.js";
import { Radon } from "./pages/Radon";
import { Settings } from "./pages/Settings/index.js";
import { AboutBlank } from "./AboutBlank";
import "./style.css";
import "./themes/main.css";
import "./i18n";

export default function Routes() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/discord" component={DiscordPage} />
        <Route path="/games" component={Radon} />
        <Route path="/go/:url" component={ProxyFrame} />
        <Route path="/settings" component={Settings} />
        <Route path="/ab/:url" component={AboutBlank} />
        <Route default component={NotFound} />
      </Router>
    </LocationProvider>
  );
}

