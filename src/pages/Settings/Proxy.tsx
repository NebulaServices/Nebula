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
    { id: "dynamic", label: "Dynamic" }
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
          name={t("settings.proxy.title")}
          storageKey="proxy"
          options={engines}
          refresh={false}
        />
      </motion.div>
    </motion.div>
  );
};
export default Proxy;

