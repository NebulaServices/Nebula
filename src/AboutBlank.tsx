import { LoadSuspense } from "./LoadSuspense";

export function AboutBlank(props: { url: string }) {
  var newWindow = window.open("about:blank");
  var iframe = document.createElement("iframe");
  iframe.src = window.location.origin + props.url;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  newWindow.document.body.appendChild(iframe);
  window.location.replace("https://google.com");
  return (
    <div>
      <LoadSuspense />
    </div>
  );
}
