import { render } from "preact";
import { LocationProvider, Router, Route } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/_404.jsx";
import { DiscordPage } from "./pages/discord.jsx";

import "./style.css";
import "./themes/main.css";
import "./i18n";

export function App() {
  return (
    <LocationProvider>
      <div class="flex h-screen flex-col">
        <Header />
        <div class="flex-1 bg-primary">
          <main class="h-full">
            <Router>
              <Route path="/" component={Home} />
              <Route path="/discord" component={DiscordPage} />
              <Route default component={NotFound} />
            </Router>
          </main>
        </div>
      </div>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
