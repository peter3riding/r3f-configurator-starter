import { useProgress } from "@react-three/drei";
import { motion } from "motion/react";

export function Loader() {
  const { progress } = useProgress();

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-12 w-28 h-28 relative">
            <div className="absolute inset-0 border-4 border-zinc-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="text-white text-5xl font-light tracking-widest mb-4">
            CRAFTING
          </div>
          <div className="text-zinc-400 text-2xl">{Math.round(progress)}%</div>
        </div>
      </div>
    </motion.div>
  );
}
