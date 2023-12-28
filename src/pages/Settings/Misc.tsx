import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";

const Misc = ({ id, active }) => {
  const { t } = useTranslation();

  const languages = [
    { id: "en-US", label: t("settings.languages.english") },
    { id: "es", label: t("settings.languages.spanish") },
    { id: "ja", label: t("settings.languages.japanese") }
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
        className="content-card flex flex-row flex-wrap justify-center w-full gap-4"
      >
        <div class="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-7 text-center">
          <div class="text-3xl">{t("settings.languages.title")}</div>
          <div class="text-md">{t("settings.languages.subtitle")}</div>
          <Dropdown
            storageKey="i18nextLng"
            options={languages}
            refresh={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Misc;
