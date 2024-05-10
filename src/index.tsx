import { render } from "preact";
import { Suspense, lazy } from "preact/compat";
import { LoadSuspense } from "./LoadSuspense";
import Meta from "./components/Meta";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { useEffect, useState } from "preact/compat";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";

const Routes = lazy(() => import("./routes"));

const particlesUrl = localStorage.getItem("particles") || "none";

export default function App() {
  const [init, setInit] = useState(false);
  const { background } = useTheme();
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
    <div className={!background && "bg-primary"}>
      {window.location.origin === "https://nebulaproxy.io" && <Meta />}
      {/* {window.location.origin === "http://localhost:8080" && <Meta />} */}
      <Suspense fallback={<LoadSuspense />}>
        <div className="fixed z-30 h-full w-full">
          <Routes />
        </div>
        <div
          className="fixed z-10 h-full w-full bg-primary"
          style={{
            backgroundImage: background ? `url(${background})` : "none",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        >
          {init && particlesUrl !== "none" && (
            <Particles
              id="tsparticles"
              url={particlesUrl}
              particlesLoaded={particlesLoaded}
              className="bg-primary"
            />
          )}
        </div>
      </Suspense>
      {/* <video muted autoplay loop className="relative z-10 h-screen w-full object-cover">
        <source
          src="bg.mp4"
          type="video/mp4"
        />
        </video> */}
    </div>
  );
}

render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("app")
);
