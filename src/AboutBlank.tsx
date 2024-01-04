import { LoadSuspense } from "./LoadSuspense";

export function AboutBlank(props: { url: string }) {
  var newWindow = window.open("about:blank");
  var iframe = document.createElement("iframe");
  iframe.src = window.location.origin + props.url;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.style.margin = "0";
  iframe.style.padding = "0";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.bottom = "0";
  iframe.style.left = "0";
  iframe.style.right = "0";
  newWindow.document.body.appendChild(iframe);
  window.location.replace("https://google.com");
  return (
    <div>
      <LoadSuspense />
    </div>
  );
}
