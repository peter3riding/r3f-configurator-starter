import { motion, type HTMLMotionProps } from "motion/react";
import { itemVariants } from "./variants.ts";

const baseClasses =
  "bg-[#dd5c18] hover:bg-black text-white font-bold uppercase flex items-center gap-3.75 px-7.5 py-3.75 rounded-md border border-black/30 pointer-events-auto cursor-pointer";

export default function ActionButton({
  children,
  className = "",
  ...props
}: HTMLMotionProps<"button">) {
  return (
    <motion.button
      type="button"
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
