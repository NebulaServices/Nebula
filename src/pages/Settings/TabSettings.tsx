import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import CloakPreset from "./CloakPreset";
import { useTranslation } from "react-i18next";
import { AboutBlank } from "../../AboutBlank";
const TabSettings = ({ id, active }) => {
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
        <div className="text-3xl font-bold text-input-text">
          {t("settings.cloaking.title")}
        </div>
        <div className="text-md pb-5 font-bold text-input-text">
          {t("settings.cloaking.subtitle")}
        </div>
        <div className="flex flex-row space-x-4">
          <CloakPreset faviconUrl="none" title="none" />
          <CloakPreset
            faviconUrl="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://google.com&size=32"
            title="Google"
          />
          <CloakPreset
            faviconUrl="https://www.wikipedia.org/static/favicon/wikipedia.ico"
            title="Wikipedia"
          />
          <CloakPreset
            faviconUrl="https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico"
            title="Dashboard"
          />
          <CloakPreset
            faviconUrl="https://ssl.gstatic.com/classroom/ic_product_classroom_144.png"
            title="Home"
          />
          <CloakPreset
            faviconUrl="https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico"
            title="Home | Schoology"
          />
        </div>
        <div className="relative p-4">
          <button
            className="font-roboto h-14 w-56 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl font-bold text-input-text placeholder:text-input-text focus:outline-none"
            onClick={() => {
              AboutBlank();
            }}
          >
            {t("settings.cloaking.aboutblank")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default TabSettings;
