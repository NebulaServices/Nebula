import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";

const Misc = ({ id, active }) => {
  const { t } = useTranslation();

  const languages = [
    { id: "en-US", label: "English" },
    { id: "es", label: "Español" },
    { id: "ja", label: "日本語" }
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
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-7 text-center">
          <div className="text-3xl font-bold text-input-text">
            {t("settings.languages.title")}
          </div>
          <div className="text-md font-bold text-input-text">
            {t("settings.languages.subtitle")}
          </div>
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
