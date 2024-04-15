import { render } from "preact";
import { Suspense, lazy } from "preact/compat";
import { LoadSuspense } from "./LoadSuspense";
import Meta from "./components/Meta";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { useEffect, useState } from "preact/compat";
import { ThemeProvider } from "./components/ThemeProvider";

const Routes = lazy(() => import("./routes"));

const particlesUrl = localStorage.getItem("particles") || "none";

export default function App() {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = (container) => {
    console.log(container);
  };
  return (
    <div>
      {window.location.origin === "https://nebulaproxy.io" && <Meta />}
      {/* {window.location.origin === "http://localhost:8080" && <Meta />} */}
      <Suspense fallback={<LoadSuspense />}>
        <Routes />
        <div className="z-10 h-full w-full bg-primary">
          {init && particlesUrl !== "none" && (
            <Particles
              id="tsparticles"
              url={particlesUrl}
              particlesLoaded={particlesLoaded}
              class="bg-primary"
            />
          )}
        </div>
      </Suspense>
    </div>
  );
}

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("app")
);
