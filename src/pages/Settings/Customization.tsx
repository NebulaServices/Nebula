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
      <img src="/comingsoonsnake.png" class="h-72 w-72"></img>
      <h1 class="font-roboto text-3xl">Coming soon!</h1>
    </motion.div>
  </motion.div>
);

export default Customization;
