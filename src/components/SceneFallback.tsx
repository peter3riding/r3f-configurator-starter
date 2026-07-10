import { useErrorBoundary } from "react-error-boundary";

interface SceneFallbackProps {
  message?: string;
  error?: Error;
  resetErrorBoundary?: () => void;

  canRetry?: boolean;
}

const SceneFallback = ({
  message = "The 3D preview is unavailable right now.",
  error,
  resetErrorBoundary,
  canRetry = true,
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
        background: "#0f172a",
        color: "#e2e8f0",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <img
        src="/fallback-shirt.png"
        alt="Shirt preview"
        style={{
          width: "260px",
          maxWidth: "70%",
          height: "auto",
          marginBottom: "2rem",
        }}
      />

      <h2
        style={{
          margin: "0 0 0.75rem",
          fontSize: "1.6rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {message}
      </h2>

      <p
        style={{
          maxWidth: "420px",
          fontSize: "1rem",
          lineHeight: 1.6,
          margin: "0 0 2rem",
          color: "#94a3b8",
        }}
      >
        You can still browse the rest of the page. Try again, or reload if the
        problem continues.
        {error && (
          <small
            style={{
              display: "block",
              marginTop: "1rem",
              opacity: 0.6,
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          >
            {error.message}
          </small>
        )}
      </p>

      {canRetry && (
        <button
          onClick={handleReset}
          style={{
            padding: "14px 40px",
            fontSize: "1rem",
            fontWeight: 600,
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default SceneFallback;
