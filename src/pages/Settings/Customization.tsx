import { motion } from "framer-motion";
import { tabContentVariant, settingsPageVariant } from "./Variants";

const Customization = ({ id, active }) => (
    <motion.div
      role="tabpanel"
      id={id}
      className="tab-content"
      variants={tabContentVariant}
      animate={active ? "active" : "inactive"}
      initial="inactive"
    >
      <motion.div variants={settingsPageVariant} className="content-card">
        <h1>Customization</h1>
      </motion.div>
    </motion.div>
);

export default Customization;
