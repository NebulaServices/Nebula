import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import { useTranslation } from "react-i18next";



import classroomIcon from "../../favicons/classroom.png";
const favicons = [
  {
    id: "nebula",
    img: "/logo.png",
  },
  {
    id: "classroom",
    img: "/favicons/classroom.png",
  },
  {
    id: "docs",
    img: "/favicons/docs.ico",
  },
];

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
      <motion.div variants={settingsPageVariant} className="content-card">
        <h1>Favicon</h1>
        <div class="flex justify-evenly">
          {
            favicons.map(icon =>
            (<div>
              <button onClick={() => {
                const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                link.href = `${icon.img}`;
                const title = document.querySelector("title");
                title.innerText = t(`favicons.${icon.id}.title`);
              }}>
                <img width="32" height="32" src={icon.img} alt={t(`favicons.${icon.id}.name`)} />
                {t(`favicons.${icon.id}.name`)}
              </button>
            </div>
            )
            )
          }
        </div>
      </motion.div>
    </motion.div>
  )
};

export default TabSettings;
