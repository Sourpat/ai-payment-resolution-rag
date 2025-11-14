export default function Landing() {
  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      padding: "60px",
      textAlign: "center",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        AI Payment Resolution Assistant ⚡
      </h1>

      <p style={{
        fontSize: "20px",
        lineHeight: "32px",
        color: "#444",
        maxWidth: "650px",
        margin: "0 auto"
      }}>
        A smart debugging assistant designed to help developers quickly diagnose
        payment-related errors using rules, RAG, and contextual AI reasoning.
      </p>

      <button
        onClick={() => window.location.href = "/app"}
        style={{
          marginTop: "40px",
          background: "#000",
          color: "#fff",
          padding: "16px 32px",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          border: "none"
        }}
      >
        Open the App →
      </button>
    </div>
  );
}
