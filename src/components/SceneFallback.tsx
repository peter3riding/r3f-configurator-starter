import { useErrorBoundary } from "react-error-boundary";

interface SceneFallbackProps {
  message?: string;
  error?: Error;
  resetErrorBoundary?: () => void;
}

const SceneFallback = ({
  message = "Something went wrong loading the 3D view.",
  error,
  resetErrorBoundary,
}: SceneFallbackProps) => {
  const { resetBoundary } = useErrorBoundary();

  const handleReset = () => {
    resetErrorBoundary?.();
    resetBoundary();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e2937 50%, #334155 100%)",
        color: "#e2e8f0",
        textAlign: "center",
        padding: "2rem",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 2026 Futuristic Shirt Visual */}
      <div
        style={{
          marginBottom: "2.5rem",
          padding: "1.5rem",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        <img
          src="https://picsum.photos/id/1060/460/340"
          alt="2026 Adaptive Shirt Concept"
          style={{
            maxWidth: "100%",
            height: "auto",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            filter: "contrast(1.15) saturate(1.3)",
          }}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: "3.5rem",
            lineHeight: 1,
            marginBottom: "0.5rem",
            opacity: 0.9,
          }}
        >
          ⚠️
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "2.4rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #60a5fa, #c084fc, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          2026 • Viewer Error
        </h2>
      </div>

      <p
        style={{
          maxWidth: "480px",
          fontSize: "1.15rem",
          lineHeight: "1.65",
          marginBottom: "2rem",
          color: "#94a3b8",
        }}
      >
        {message}
        {error && (
          <small
            style={{
              display: "block",
              marginTop: "1rem",
              opacity: 0.7,
              fontFamily: "monospace",
            }}
          >
            {error.message}
          </small>
        )}
      </p>

      <button
        onClick={handleReset}
        style={{
          padding: "16px 44px",
          fontSize: "1.1rem",
          fontWeight: 600,
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
          backgroundSize: "200% 100%",
          color: "white",
          border: "none",
          borderRadius: "9999px",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 10px 15px -3px rgb(59 130 246 / 0.3)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundPosition = "right center";
          e.currentTarget.style.transform = "translateY(-3px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundPosition = "left center";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Retry 2026 Experience
      </button>

      <p
        style={{
          marginTop: "2.5rem",
          fontSize: "0.9rem",
          color: "#64748b",
        }}
      >
        Built for modern React • Canvas / useGLTF errors safely caught
      </p>
    </div>
  );
};

export default SceneFallback;
