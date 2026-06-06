export default function LoadingSpinner({ fullPage = false, size = 40, message = "" }) {
  if (fullPage) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          zIndex: 200,
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid var(--color-surface-3)",
            borderTopColor: "var(--color-lime)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--color-text-primary)",
            }}
          >
            PetNest
          </span>
          {message && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
              }}
            >
              {message}
            </span>
          )}
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: "3px solid var(--color-surface-3)",
          borderTopColor: "var(--color-lime)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {message && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-muted)",
          }}
        >
          {message}
        </p>
      )}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}