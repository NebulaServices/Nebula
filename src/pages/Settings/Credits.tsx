import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";
import { useTranslation } from "react-i18next";
import { PersonCard } from "./PersonCard";

export const Credits = ({ id, active }) => {
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
        className="content-card flex w-full flex-row flex-wrap justify-center gap-4"
      >
        <div className="w-full p-10 text-input-text">
          <div className="py-3">
            <p className="text-4xl">{t("credits.devs")}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <PersonCard
                name="Riftriot"
                url="https://github.com/riftriot/"
                profile="https://avatars.githubusercontent.com/u/117926989?v=4"
              />
              <PersonCard
                name="MotorTruck1221"
                url="https://github.com/MotorTruck1221"
                profile="https://avatars.githubusercontent.com/u/73721704?v=4"
              />
              <PersonCard
                name="Cohen"
                url="https://github.com/cohenerickson"
                profile="https://avatars.githubusercontent.com/u/72945444?v=4"
              />
              <PersonCard
                name="FireStreaker2"
                url="https://github.com/FireStreaker2"
                profile="https://avatars.githubusercontent.com/u/103970465?v=4"
              />
              <PersonCard
                name="wearr"
                url="https://github.com/wearrrrr"
                profile="https://avatars.githubusercontent.com/u/99224452?v=4"
              />
            </div>
            <p className="mt-12 text-4xl">{t("credits.jpTranslators")}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <PersonCard
                name="ProgrammerIn-wonderland"
                url="https://github.com/ProgrammerIn-wonderland"
                profile="https://avatars.githubusercontent.com/u/30693865?v=4"
              />
              <PersonCard
                name="wearr"
                url="https://github.com/wearrrrr"
                profile="https://avatars.githubusercontent.com/u/99224452?v=4"
              />
              <PersonCard
                name="suzumiya39"
                url="https://github.com/suzumiya39"
                profile="https://avatars.githubusercontent.com/u/165246341?v=4"
              />
            </div>
            <p className="mt-12 text-4xl">{t("credits.esTranslators")}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <PersonCard
                name="Cohen"
                url="https://github.com/cohenerickson"
                profile="https://avatars.githubusercontent.com/u/72945444?v=4"
              />
              <PersonCard
                name="Notplayingallday383"
                url="https://github.com/Notplayingallday383"
                profile="https://avatars.githubusercontent.com/u/72810050?v=4"
              />
            </div>
            <a href="https://github.com/titaniumnetwork-dev/Ultraviolet">
              <p className="mt-12 text-4xl underline">Ultraviolet</p>
            </a>
            <a href="https://github.com/binary-person/Rammerhead">
              <p className="mt-12 text-4xl underline">Rammerhead</p>
            </a>
            <a href="https://github.com/nebulaservices/dynamic">
              <p className="mt-12 text-4xl underline">Dynamic</p>
            </a>
            <a href="https://github.com/MercuryWorkshop/epoxy-tls">
              <p className="mt-12 text-4xl underline">epoxy-tls</p>
            </a>
            <a href="https://github.com/MercuryWorkshop/libcurl.js">
              <p className="mt-12 text-4xl underline">libcurl.js</p>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
