import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import BareInput from "./BareInput";
import WispInput from "./WispInput";
import ProxyInput from "./ProxyInput";
import { useTranslation } from "react-i18next";
import TransportDropdown from "./transportDropdown";

import RammerheadLogo from "../../assets/rammerhead.png";
import UltravioletLogo from "../../assets/ultraviolet.png";
import AutomaticLogo from "../../assets/automatic.png";
import DynamicLogo from "../../assets/dynamic.png";
import GoogleLogo from "../../assets/google.png";
import BingLogo from "../../assets/bing.png";
import DuckDuckGoLogo from "../../assets/ddg.png";

const Proxy = ({ id, active }) => {
  const { t } = useTranslation();
  const transport = localStorage.getItem("transport") || "libcurl";
  const proccy = localStorage.getItem("proxy") || "automatic";

  const engines = [
    {
      id: "automatic",
      label: t("settings.proxy.automatic"),
      image: AutomaticLogo
    },
    { id: "ultraviolet", label: "Ultraviolet", image: UltravioletLogo },
    { id: "rammerhead", label: "Rammerhead", image: RammerheadLogo },
    { id: "dynamic", label: "Dynamic", image: DynamicLogo }
  ];

  const proxyModes = [
    { id: "embed", label: t("settings.proxymodes.embed") },
    { id: "direct", label: t("settings.proxymodes.direct") },
    { id: "aboutblank", label: t("settings.proxymodes.aboutblank") }
  ];

  const searchEngines = [
    {
      id: "https://duckduckgo.com/?q=%s",
      label: "DuckDuckGo",
      image: DuckDuckGoLogo
    },
    {
      id: "https://google.com/search?q=%s",
      label: "Google",
      image: GoogleLogo
    },
    { id: "https://bing.com/search?q=%s", label: "Bing", image: BingLogo }
  ];

  const wispUrl =
    (location.protocol === "https:" ? "wss://" : "ws://") +
    location.host +
    "/wisp/";
  const transports = [
    { id: "libcurl", label: "Libcurl" },
    { id: "bare", label: "Bare Server" },
    { id: "epoxy", label: "Epoxy" }
  ];

  return (
    <motion.div
      role="tabpanel"
      id={id}
      className="tab-content"
      variants={tabContentVariant}
      animate={active ? "active" : "inactive"}
      initial="inactive"
    >
      <motion.div
        variants={settingsPageVariant}
        className="content-card flex w-full flex-row flex-wrap justify-center gap-4"
      >
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.proxy.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.proxy.subtitle")}
          </div>
          <Dropdown storageKey="proxy" options={engines} refresh={false} />
        </div>
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.proxymodes.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.proxymodes.subtitle")}
          </div>
          <Dropdown
            storageKey="proxyMode"
            options={proxyModes}
            refresh={false}
          />
        </div>
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.search.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.search.subtitle")}
          </div>
          <Dropdown
            storageKey="searchEngine"
            options={searchEngines}
            refresh={false}
          />
        </div>
        {transport === "bare" && (
          <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
            <div className="p-2 text-3xl font-bold text-input-text">
              {t("settings.bare.title")}
            </div>
            <div className="text-md p-4 font-bold text-input-text">
              {t("settings.bare.subtitle")}
            </div>
            <BareInput
              placeholder={location.origin + "/bare/"}
              storageKey="bare"
            />
          </div>
        )}
        {transport !== "bare" && (
          <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
            <div className="p-2 text-3xl font-bold text-input-text">
              {t("settings.wisp.title")}
            </div>
            <div className="text-md p-4 font-bold text-input-text">
              {t("settings.wisp.subtitle")}
            </div>
            <WispInput placeholder={wispUrl} />
          </div>
        )}
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.transport.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.transport.desc")}
          </div>
          <TransportDropdown
            storageKey="transport"
            options={transports}
            refresh={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Proxy;
