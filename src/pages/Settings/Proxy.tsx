import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";
import Dropdown from "./Dropdown";

const Proxy = ({ id, active }) => {
  const engines = ["Automatic", "Ultraviolet", "Rammerhead", "Dynamic"];

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
        <Dropdown name="Engine" options={engines} />
      </motion.div>
    </motion.div>
  );
};
export default Proxy;

