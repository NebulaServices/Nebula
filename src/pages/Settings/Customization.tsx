import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import { useTranslation } from "react-i18next";

function Customization({ id, active }) {
  const { t } = useTranslation();
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
        <img src="/comingsoonsnake.png" class="h-72 w-72"></img>
        <h1 class="font-roboto text-3xl">{t("comingsoon")}</h1>
      </motion.div>
    </motion.div>
  );
}

export default Customization;
