import { useProgress, Html } from "@react-three/drei";
import { useEffect, useState } from "react";

type Props = {
  onLoaded: () => void;
};

export function Loader({ onLoaded }: Props) {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress >= 97 && !active) {
      onLoaded(); // Notify parent
      setTimeout(() => {
        setVisible(false); // Hide loader
      }, 600);
    }
  }, [progress, active, onLoaded]);

  if (!visible) return null;

  return (
    <Html center portal={undefined} style={{ zIndex: 10000 }}>
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
    </Html>
  );
}
