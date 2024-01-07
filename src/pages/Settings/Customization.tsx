import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";

function Customization({ id, active }) {
  const { t } = useTranslation();

  const themes = [
    { id: "main", label: t("themes.main") },
    { id: "catppuccinMocha", label: t("themes.catppuccinMocha") },
    { id: "catppuccinMacchiato", label: t("themes.catppuccinMacchiato") },
    { id: "catppuccinFrappe", label: t("themes.catppuccinFrappe") },
    { id: "catppuccinLatte", label: t("themes.catppuccinLatte") }
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
        className="content-card flex w-full flex-col items-center justify-center text-center"
      >
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.theme.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.theme.subtitle")}
          </div>
          <Dropdown storageKey="theme" options={themes} refresh={true} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Customization;
