import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";
import { ErrorBoundary } from "react-error-boundary";
import SceneFallback from "./components/SceneFallback";

const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {hasWebGL ? (
      <ErrorBoundary
        fallback={
          <SceneFallback message="Something went wrong loading the 3D view." />
        }
      >
        <Root />
      </ErrorBoundary>
    ) : (
      <SceneFallback message="Your browser doesn't support 3D (WebGL)." />
    )}
  </StrictMode>,
);
