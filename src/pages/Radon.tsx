import { HeaderRoute } from "../components/HeaderRoute";
interface Window {
  __uv$config: any;
}
export function Radon() {
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
