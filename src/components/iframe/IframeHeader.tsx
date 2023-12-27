import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { Link } from "preact-router";
import { RiPictureInPictureExitFill, RiFullscreenFill } from "react-icons/ri";
import { IoCodeSlashSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
export function IframeHeader(props: { url: string }) {
  const { t } = useTranslation();
  const [showPopout, setShowPopout] = useState(false);
  const [showFullScreen, setFullScreen] = useState(false);

  if (showPopout) {
    window.location.replace(props.url);
  }
  if (showFullScreen) {
    document.getElementById("iframe").requestFullscreen();
    setFullScreen(false);
  }
  return (
    <div
      id="iframeNav"
      className="flex h-16 flex-row items-center justify-between bg-navbar-color px-4"
    >
      <Link href="/" class="w-1/8">
        <div className="flex flex-row items-center">
          <img
            src="/logo.png"
            className="h-16 w-16 transition-all duration-1000 hover:rotate-[360deg]"
          ></img>
          <h1 className="font-roboto text-2xl font-bold text-navbar-text-color md:text-4xl">
            {" "}
            {t("header.title")}{" "}
          </h1>
        </div>
      </Link>
      <div id="navItems" class="w-1/2">
        <div className="mr-4 flex flex-row items-center justify-end gap-3">
          <IoCodeSlashSharp
            className="duration-0500 h-6 w-6 cursor-pointer text-navbar-text-color transition-all hover:scale-110 hover:brightness-125"
            onClick={() => {
                const proccy = document.getElementById("iframe");
                if (!proccy) return;
                // @ts-ignore
                const proccyWindow = proccy.contentWindow;
                // @ts-ignore
                const proccyDocument = proccy.contentDocument;
            
                if (!proccyWindow || !proccyDocument) return;
            
                if (proccyWindow.eruda?._isInit) {
                    proccyWindow.eruda.destroy();
                } else {
                    let script = proccyDocument.createElement('script');
                    script.src = "https://cdn.jsdelivr.net/npm/eruda";
                    script.onload = function() {
                        if (!proccyWindow) return;
                        proccyWindow.eruda.init();
                        proccyWindow.eruda.show();
                    }
                    proccyDocument.head.appendChild(script);
                }
                    }
                  }
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
  );
}
