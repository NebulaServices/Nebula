import { HeaderRoute } from "../components/HeaderRoute";
import { setTransport } from "../util/transports";
interface Window {
  __uv$config: any;
}
export function Radon() {
  //make sure there is a transport set
  setTransport();
  return (
    <HeaderRoute>
      <iframe
        src={
          window.__uv$config.prefix +
          window.__uv$config.encodeUrl("https://radon.games")
        }
        className="h-full w-full"
      ></iframe>
    </HeaderRoute>
  );
}
