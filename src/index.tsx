import { render } from "preact";
import { Suspense, lazy } from "preact/compat";
const Routes = lazy(() => import("./routes"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div>
          <div>loading...</div>
        </div>
      }
    >
      <div>
        <Routes />
      </div>
    </Suspense>
  );
}

render(<App />, document.getElementById("app"));
