import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";

const Misc = ({ id, active }) => {
  const { t } = useTranslation();
  
  const languages = [
    { id: "ja", label: t("settings.languages.japanese") },
    { id: "en-US", label: t("settings.languages.english") }
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
        className="content-card flex flex-row flex-wrap justify-around"
      >
        <Dropdown
          name={t("settings.languages.title")}
          storageKey="i18nextLng"
          options={languages}
          refresh={true}
        />
      </motion.div>
    </motion.div>
  );
};
export default Misc;
