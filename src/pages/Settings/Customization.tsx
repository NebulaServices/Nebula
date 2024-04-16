import { useRef } from "preact/hooks";
import { useTheme } from "../../components/ThemeProvider";
import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
import ThemeDropdown from "./ThemeDropdown";

function Customization({ id, active }) {
  const bgInput = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { background, setBackground } = useTheme();
  const particles = [
    { id: "none", label: t("settings.theme.particlesNone") },
    { id: "/crismas.json", label: t("themes.crismas") }
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
            {t("settings.theme.title")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.theme.subtitle")}
          </div>
          <ThemeDropdown />
        </div>
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.theme.particles")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.theme.particlesDesc")}
          </div>
          <Dropdown storageKey="particles" options={particles} refresh={true} />
        </div>
        <div className="flex h-64 w-80 flex-col flex-wrap content-center items-center rounded-lg border border-input-border-color bg-lighter p-2 text-center">
          <div className="p-2 text-3xl font-bold text-input-text">
            {t("settings.theme.background")}
          </div>
          <div className="text-md p-4 font-bold text-input-text">
            {t("settings.theme.backgroundDesc")}
          </div>
          <input
            ref={bgInput}
            className="font-roboto h-14 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl text-input-text placeholder:text-input-text"
            defaultValue={background}
            placeholder={t("settings.theme.backgroundNone")}
          />
          <button
            onClick={() => setBackground(bgInput.current.value)}
            className="font-roboto mt-2 flex h-4 w-36 cursor-pointer flex-row items-center justify-center rounded-xl border border-input-border-color bg-input p-5 text-center text-lg text-input-text"
          >
            {t("settings.theme.select")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Customization;
