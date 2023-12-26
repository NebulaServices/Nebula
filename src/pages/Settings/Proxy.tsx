import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";

const Proxy = ({ id, active }) => {
  const { t } = useTranslation();

  const engines = [
    { id: "automatic", label: t("settings.proxy.automatic") },
    { id: "ultraviolet", label: "Ultraviolet" },
    { id: "rammerhead", label: "Rammerhead" },
    { id: "dynamic", label: "Dynamic " + t("settings.proxy.buggyWarning") }
  ];

  const proxyModes = [
    { id: "direct", label: t("settings.proxymodes.direct") },
    { id: "embed", label: t("settings.proxymodes.embed") },
    { id: "aboutblank", label: t("settings.proxymodes.aboutblank") }
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
        className="content-card justify-left flex w-full flex-row flex-wrap gap-4"
      >
        <div class="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-7 text-center">
          <div class="p-2 text-3xl">{t("settings.proxy.title")}</div>
          <div class="text-md p-4">{t("settings.proxy.subtitle")}</div>
          <Dropdown storageKey="proxy" options={engines} refresh={false} />
        </div>
        <div class="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-7 text-center">
          <div class="p-2 text-3xl">{t("settings.proxymodes.title")}</div>
          <div class="text-md p-4">{t("settings.proxymodes.subtitle")}</div>
          <Dropdown
            storageKey="proxyMode"
            options={proxyModes}
            refresh={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Proxy;
