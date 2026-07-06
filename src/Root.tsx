import App from "./App";
import Overlay from "./Overlay";
import { Leva } from "leva";
import { Loader } from "./components/Loader";
import { AnimatePresence } from "motion/react";
import { useProgress } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import SceneFallback from "./components/SceneFallback";

export default function Root() {
  const { active, progress } = useProgress();
  const isLoaded = !active && progress > 0;
  return (
    <>
      <ErrorBoundary
        fallback={
          <SceneFallback message="Something went wrong loading the 3D view." />
        }
      >
        <App />

        <Overlay />
      </ErrorBoundary>
      <AnimatePresence>{!isLoaded && <Loader />}</AnimatePresence>
      {import.meta.env.DEV && <Leva collapsed />}
    </>
  );
}
