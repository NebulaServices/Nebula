import { useState, useEffect } from "preact/hooks";
import CryptoJS from "crypto-js";
import { useTranslation } from "react-i18next";
import { dec } from "../../aes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "preact-router";
import { RiPictureInPictureExitFill, RiFullscreenFill } from "react-icons/ri";
import {
  IoCodeSlashSharp,
  IoChevronBackSharp,
  IoChevronForwardSharp,
  IoReloadSharp
} from "react-icons/io5";
import { FaShareAlt } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface ProxyFrame extends HTMLElement {
  contentWindow: any;
  contentDocument: any;
}

function Clipboard(text) {
  var textarea = document.createElement("textarea"); // hacky
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function IframeHeader(props: { url: string }) {
  const localProxy = localStorage.getItem("proxy") || "automatic";

  const { t } = useTranslation();

  const share = () => {
    let proxyFrame: ProxyFrame | null = document.getElementById(
      "iframe"
    ) as ProxyFrame;

    if (localProxy === "ultraviolet" || localProxy === "automatic") {
      var encodedUrl = proxyFrame.contentWindow.location.href
        .replace(window.location.origin, "")
        .replace(window.__uv$config.prefix, "");

      //@ts-ignore
      let decodedUrl = CryptoJS.AES.decrypt(
        "U2FsdGVkX1" + encodedUrl,
        location.origin + navigator.userAgent
      ).toString(CryptoJS.enc.Utf8);
      Clipboard(decodedUrl);
      toast(t("clipboard"));
    } else {
      toast("Your proxy choice doesn't support sharing.");
    }
  };

  const [showPopout, setShowPopout] = useState(false);
  const [showFullScreen, setFullScreen] = useState(false);
  const [proxiedTitle, setProxiedTitle] = useState("");
  const [proxiedFavicon, setProxiedFavicon] = useState("/generic_globe.png");

  useEffect(() => {
    const intervalFunction = () => {
      let proxyFrame: ProxyFrame | null = document.getElementById(
        "iframe"
      ) as ProxyFrame;
      if (proxyFrame) {
        let faviconLink =
          proxyFrame.contentDocument.querySelector("link[rel*='icon']");
        if (faviconLink) {
          setProxiedFavicon(faviconLink.href);
        } else {
          setProxiedFavicon("/generic_globe.png");
        }
        setProxiedTitle(proxyFrame.contentDocument.title);
      } else {
        console.log(
          "ehhh this aint supposed to happen. no proxied iframe found."
        );
      }
    };

    const intervalId = setInterval(intervalFunction, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (showPopout) {
    window.location.replace(props.url);
  }
  if (showFullScreen) {
    document.getElementById("iframe").requestFullscreen();
    setFullScreen(false);
  }
  return (
    <div>
      <div
        id="iframeNav"
        className="flex h-16 flex-row items-center justify-between gap-3 bg-navbar-color px-4"
      >
        <div className="w-1/8">
          <div className="flex flex-row items-center">
            <img src={proxiedFavicon} className="h-12 w-12 p-2"></img>
            <h1 className="font-roboto whitespace-normal text-sm font-bold text-text-color sm:visible sm:text-lg">
              {proxiedTitle ? proxiedTitle : "Loading..."}
            </h1>
          </div>
        </div>
        <div id="navItems" className="w-1/8">
          <div className="mr-4 flex flex-row items-center justify-end gap-3">
            <IoChevronBackSharp
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
              onClick={() => {
                const proxyFrame: ProxyFrame | null = document.getElementById(
                  "iframe"
                ) as ProxyFrame;
                proxyFrame.contentWindow.history.back();
              }}
            />
            <IoChevronForwardSharp
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
              onClick={() => {
                const proxyFrame: ProxyFrame | null = document.getElementById(
                  "iframe"
                ) as ProxyFrame;
                proxyFrame.contentWindow.history.forward();
              }}
            />
            <IoReloadSharp
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:rotate-[360deg] hover:scale-110 hover:brightness-125"
              onClick={() => {
                const proxyFrame: ProxyFrame | null = document.getElementById(
                  "iframe"
                ) as ProxyFrame;
                proxyFrame.contentWindow.location.reload();
              }}
            />
            <FaShareAlt
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
              onClick={share}
            />
            <IoCodeSlashSharp
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
              onClick={() => {
                const proxyFrame: ProxyFrame | null = document.getElementById(
                  "iframe"
                ) as ProxyFrame;
                if (!proxyFrame) return;

                const proxyWindow = proxyFrame.contentWindow;

                const proxyDocument = proxyFrame.contentDocument;

                if (!proxyWindow || !proxyDocument) return;

                if (proxyWindow.eruda?._isInit) {
                  proxyWindow.eruda.destroy();
                } else {
                  let script = proxyDocument.createElement("script");
                  script.src = "https://cdn.jsdelivr.net/npm/eruda";
                  script.onload = function () {
                    if (!proxyWindow) return;
                    proxyWindow.eruda.init({
                      defaults: {
                        displaySize: 45,
                        theme: "Material Palenight"
                      }
                    });
                    proxyWindow.eruda.show();
                  };
                  proxyDocument.head.appendChild(script);
                }
              }}
            />
            <RiPictureInPictureExitFill
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
              onClick={() => setShowPopout(true)}
            />
            <RiFullscreenFill
              className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125 active:rotate-90"
              onClick={() => setFullScreen(true)}
            />
            <Link href="/">
              <FaXmark className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:rotate-[360deg] hover:scale-110 hover:brightness-125" />
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" type="sucess" theme="dark" />
    </div>
  );
}
