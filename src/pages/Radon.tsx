import { HeaderRoute } from "../components/HeaderRoute";
declare global {
  interface Window {
    __uv$config: any;
    __dynamic$config: any;
  }
}

export function gameProxy() {
  const localProxy = localStorage.getItem("proxy") || "automatic";

  if (localProxy == "ultraviolet") {
    return window.__uv$config.prefix + window.__uv$config.encodeUrl("https://radon.games")
  };

  if (localProxy == "dynamic") {
   // return window.__dynamic$config.prefix + window.__dynamic$config.encoding("https://radon.games") 
    return window.__dynamic$config.prefix + "route?url=" + encodeURIComponent("https://radon.games")
  }

  else {
    return window.__uv$config.prefix + window.__uv$config.encodeUrl("https://radon.games")
  }
};

  
export function Radon() {
  return (
    <HeaderRoute>
      
      <iframe
        src={
          gameProxy()
        }
        className="h-full w-full"
      ></iframe>
    </HeaderRoute>
  );
}
