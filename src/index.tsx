import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";
import { DiscordPage } from "./pages/discord.jsx";
import { ProxyFrame } from "./ProxyFrame.js";
import { Settings } from "./pages/Settings/index.js";

import "./style.css";
import "./themes/main.css";
import "./i18n";

export function App() {
  return (
    <LocationProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/discord" component={DiscordPage} />
        <Route path="/proxyframe/:id" component={ProxyFrame} />
        <Route path="/settings" component={Settings} />
        <Route default component={NotFound} />
      </Router>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
