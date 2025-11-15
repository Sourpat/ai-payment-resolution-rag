import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./Navbar.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function Badge({ children, tone = "gray" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function SectionCard({ title, children, extra }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        <div className="head-extra">{extra}</div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function App() {
  const [errorCode, setErrorCode] = useState("PAYMENT_METHOD_ERROR");
  const [message, setMessage] = useState("Card declined: AVS mismatch");
  const [trace, setTrace] = useState("");
  const [loading, setLoading] = useState(false);
  const [ping, setPing] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const client = useMemo(() => axios.create({ baseURL: API_BASE }), []);

  useEffect(() => {
  (async () => {
    try {
      const res = await client.get("/support/ping");
      setPing(res.data);

      // Expose API status to Navbar
      window.__API_STATUS__ = res.data?.ok ? true : false;
    } catch (e) {
      setPing({ ok: false });

      // API is offline
      window.__API_STATUS__ = false;
    }
  })();
}, [client]);


  const handleDiagnose = async () => {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await client.post("/support/diagnose/with-summary", {
        error_code: errorCode.trim(),
        message: message.trim(),
        trace: trace || undefined,
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
      setErr(
        "Could not reach API. Ensure the FastAPI server is running on " +
          API_BASE +
          " and CORS allows this origin."
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <>
      <Navbar />

      <main className="wrap">
        <div className="page-container">
          <header className="top">
            <h1>🧠 Dev Support Assistant</h1>
            <div className="status">
              <Badge tone={ping?.ok ? "green" : "red"}>
                API {ping?.ok ? "Online" : "Offline"}
              </Badge>
              <Badge>
                {ping?.model ? `Model: ${ping.model}` : "No model set"}
              </Badge>
              <Badge>
                {ping?.rules_source ? `Rules: ${ping.rules_source}` : ""}
              </Badge>
            </div>
          </header>

          {err && (
            <div className="alert">
              <strong>Connection error:</strong> {err}
            </div>
          )}

          <SectionCard
            title="Input"
            extra={
              <button className="btn" onClick={handleDiagnose} disabled={loading}>
                {loading ? "Diagnosing…" : "Run Diagnosis (Ctrl+Enter)"}
              </button>
            }
          >
            <div className="grid">
              <label>
                Error Code
                <input
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  placeholder="e.g., PAYMENT_METHOD_ERROR"
                />
              </label>

              <label className="span-2">
                Message
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Short error summary"
                />
              </label>

              <label className="span-2">
                Trace / Logs (optional)
                <textarea
                  rows={6}
                  value={trace}
                  onChange={(e) => setTrace(e.target.value)}
                  placeholder="Paste stack trace or relevant logs"
                />
              </label>
            </div>
            <p className="hint">
              Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run.
            </p>
          </SectionCard>

          {result && (
            <>
              <SectionCard
                title="Overview"
                extra={
                  <>
                    <Badge tone="blue">{result.category}</Badge>{" "}
                    <Badge tone={result.severity === "High" ? "red" : "yellow"}>
                      {result.severity}
                    </Badge>
                  </>
                }
              >
                <div className="kv">
                  <div>
                    <strong>Detected Error:</strong> {result.detected_error}
                  </div>
                  {Array.isArray(result.signals) && result.signals.length > 0 && (
                    <div>
                      <strong>Signals:</strong>{" "}
                      {result.signals.join(", ")}
                    </div>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="Assistant Summary"
                extra={
                  <button
                    className="btn subtle"
                    onClick={() => copy(result.assistant_summary || "")}
                  >
                    Copy
                  </button>
                }
              >
                <pre className="pre">{result.assistant_summary}</pre>
              </SectionCard>

              <div className="columns">
                <SectionCard
                  title={`Suggested Steps (${result.suggested_steps?.length || 0})`}
                  extra={
                    <button
                      className="btn subtle"
                      onClick={() =>
                        copy((result.suggested_steps || []).join("\n"))
                      }
                    >
                      Copy
                    </button>
                  }
                >
                  <ol className="steps">
                    {(result.suggested_steps || []).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </SectionCard>

                <SectionCard
                  title={`References (${result.references?.length || 0})`}
                  extra={
                    <button
                      className="btn subtle"
                      onClick={() =>
                        copy((result.references || []).join("\n"))
                      }
                    >
                      Copy
                    </button>
                  }
                >
                  <ul className="refs">
                    {(result.references || []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </SectionCard>
              </div>

              {result.raw_notes && (
                <SectionCard title="Raw Notes">
                  <pre className="pre small">{result.raw_notes}</pre>
                </SectionCard>
              )}
            </>
          )}

          <footer className="foot">
            <span>API: {API_BASE}</span>
            <span style={{ marginLeft: "auto" }}>
              Built by{" "}
              <a href="https://github.com/Sourpat" target="_blank">
                Sourabh Patil
              </a>
            </span>
          </footer>
        </div>
      </main>

      <Shortcut onTrigger={handleDiagnose} />
    </>
  );
}

function Shortcut({ onTrigger }) {
  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey && e.key === "Enter") onTrigger();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onTrigger]);
  return null;
}
