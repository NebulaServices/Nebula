import { motion } from "framer-motion";
import { IframeHeader } from "./IframeHeader";

export function Iframe(props: { url: string }) {
  return (
    <>
      <IframeHeader url={props.url} />
      <motion.div
        className="h-[calc(100%_-_4rem)] w-full select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <iframe
          id="iframe"
          src={props.url}
          className="h-full w-full border-none bg-primary"
        />
      </motion.div>
    </>
  );
}
