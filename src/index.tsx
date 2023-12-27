import { render } from "preact";
import { Suspense, lazy } from "preact/compat";
import { LoadSuspense } from "./LoadSuspense";
const Routes = lazy(() => import("./routes"));

export default function App() {
  return (
    <Suspense fallback={<LoadSuspense />}>
      <div>
        <Routes />
      </div>
    </Suspense>
  );
}

render(<App />, document.getElementById("app"));
