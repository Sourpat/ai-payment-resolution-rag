import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

import Navbar from "./Navbar.jsx";
import { findSampleCase, sampleTestCases } from "./data/sampleTestCases.js";

const API_BASE = import.meta.env.VITE_API_BASE;

const DEFAULT_ERROR = "PAYMENT_METHOD_ERROR";
const DEFAULT_MESSAGE = "Card declined: AVS mismatch";

function formatBaseUrl(base) {
  if (!base) return "";
  try {
    const url = new URL(base);
    return url.host;
  } catch {
    return base.replace(/^https?:\/\//i, "");
  }
}

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
  const [errorCode, setErrorCode] = useState(DEFAULT_ERROR);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [trace, setTrace] = useState("");
  const [loading, setLoading] = useState(false);
  const [ping, setPing] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [selectedSample, setSelectedSample] = useState(sampleTestCases[0]?.id || "");
  const [infoOpen, setInfoOpen] = useState(false);

  const client = useMemo(
    () =>
      axios.create({
        baseURL: API_BASE,
        timeout: 15000,
      }),
    []
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await client.get("/support/ping");
        if (cancelled) return;
        setPing(res.data);

        // Expose API status to Navbar
        window.__API_STATUS__ = res.data?.ok ? true : false;
      } catch (error) {
        if (cancelled) return;
        console.error("Ping failed", error);
        setPing({ ok: false });

        // API is offline
        window.__API_STATUS__ = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [client]);

  const handleDiagnose = useCallback(async () => {
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
  }, [client, errorCode, message, trace]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const applySampleCase = useCallback(
    (id) => {
      const selected = findSampleCase(id);
      if (!selected) return;
      setErrorCode(selected.error_code);
      setMessage(selected.message);
      setTrace(selected.trace || "");
    },
    []
  );

  const statusBadges = [
    <Badge key="api" tone={ping?.ok ? "green" : "red"}>
      API {ping?.ok ? "Online" : "Offline"}
    </Badge>,
    ping?.model ? (
      <Badge key="model" tone="blue">{`Model: ${ping.model}`}</Badge>
    ) : null,
    ping?.rules_source ? (
      <Badge key="rules" tone="blue">{`Rules: ${ping.rules_source}`}</Badge>
    ) : null,
    API_BASE ? (
      <Badge key="base" tone="blue">{`Base: ${formatBaseUrl(API_BASE)}`}</Badge>
    ) : null,
  ].filter(Boolean);

  const signals = Array.isArray(result?.signals) ? result.signals.filter(Boolean) : [];
  const steps = Array.isArray(result?.suggested_steps)
    ? result.suggested_steps.filter(Boolean)
    : [];
  const references = Array.isArray(result?.references)
    ? result.references.filter(Boolean)
    : [];

  return (
    <>
      <Navbar />

      <main className="wrap">
        <div className="page-container">
          <header className="top">
            <div>
              <p className="eyebrow">Live payments triage</p>
              <div className="title-row">
                <h1>AI Payment Resolution Assistant</h1>
                <button className="text-link" type="button" onClick={() => setInfoOpen(true)}>
                  What is this?
                </button>
              </div>
              <p className="lede">
                Diagnose card, ACH, and PSP issues with a blend of deterministic rules and
                RAG-powered AI summaries. Drop in the raw provider payloads and receive categorized
                actions your on-call team can trust.
              </p>
            </div>

            <div className="status">{statusBadges}</div>
          </header>

          <div className="sample-test">
            <div>
              <p className="eyebrow">Run a sample test</p>
              <p className="hint">
                Auto-fill realistic payment incidents to see how the assistant responds.
              </p>
            </div>
            <div className="sample-controls">
              <select
                value={selectedSample}
                onChange={(e) => setSelectedSample(e.target.value)}
                aria-label="Choose sample test case"
              >
                {sampleTestCases.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} • {t.category}
                  </option>
                ))}
              </select>
              <button
                className="btn subtle"
                type="button"
                onClick={() => applySampleCase(selectedSample)}
              >
                Apply sample
              </button>
            </div>
          </div>

          {err && (
            <div className="alert">
              <strong>Connection error:</strong> {err}
            </div>
          )}

          <SectionCard
            title="Incident Details"
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
              Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run. Provide any PSP specific payloads
              or trace IDs for richer RAG context.
            </p>
          </SectionCard>

          {result && (
            <>
              <SectionCard
                title="Diagnosis Overview"
                extra={
                  <>
                    {result.category && <Badge tone="blue">{result.category}</Badge>}
                    {result.severity && (
                      <Badge tone={result.severity === "High" ? "red" : "green"}>
                        Severity: {result.severity}
                      </Badge>
                    )}
                  </>
                }
              >
                <div className="kv">
                  <div>
                    <strong>Detected Error:</strong> {result.detected_error || "—"}
                  </div>
                  {signals.length > 0 && (
                    <div>
                      <strong>Signals:</strong> {signals.join(", ")}
                    </div>
                  )}
                  {result.rules_version && (
                    <div>
                      <strong>Rules Version:</strong> {result.rules_version}
                    </div>
                  )}
                </div>
              </SectionCard>

              {result.assistant_summary && (
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
              )}

              <div className="columns">
                <SectionCard
                  title={`Suggested Steps (${steps.length})`}
                  extra={
                    steps.length > 0 && (
                      <button
                        className="btn subtle"
                        onClick={() => copy(steps.join("\n"))}
                      >
                        Copy
                      </button>
                    )
                  }
                >
                  {steps.length > 0 ? (
                    <ol className="steps">
                      {steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>
                  ) : (
                    <p style={{ color: "var(--text-muted)" }}>No action items returned.</p>
                  )}
                </SectionCard>

                <SectionCard
                  title={`References (${references.length})`}
                  extra={
                    references.length > 0 && (
                      <button
                        className="btn subtle"
                        onClick={() => copy(references.join("\n"))}
                      >
                        Copy
                      </button>
                    )
                  }
                >
                  {references.length > 0 ? (
                    <ul className="refs">
                      {references.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "var(--text-muted)" }}>No references provided.</p>
                  )}
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
              <a href="https://github.com/Sourpat" target="_blank" rel="noreferrer">
                Sourabh Patil
              </a>
            </span>
          </footer>
        </div>
      </main>

      <Shortcut onTrigger={handleDiagnose} />

      {infoOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setInfoOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <p className="eyebrow">Product overview</p>
              <h3 id="modal-title">What this assistant does</h3>
              <p className="modal-lede">
                This assistant triages payment incidents with deterministic rules and RAG context,
                delivering fast, trustworthy guidance for on-call teams.
              </p>
            </div>

            <div className="modal-divider" aria-hidden="true" />

            <div className="modal-body">
              <div className="modal-section">
                <h4>How it works</h4>
                <ol className="modal-steps">
                  <li>Collects PSP payloads, error codes, and any trace IDs you provide.</li>
                  <li>Classifies the incident using curated payment rules and severity heuristics.</li>
                  <li>Retrieves similar cases from the knowledge base to enrich context.</li>
                  <li>Summarizes the diagnosis with prioritized steps and reference links.</li>
                </ol>
              </div>
              <div className="modal-section modal-examples">
                <h4>Example errors</h4>
                <div className="modal-examples-card" role="group" aria-label="Example errors list">
                  {sampleTestCases.slice(0, 5).map((sample) => (
                    <div className="modal-example-item" key={sample.id}>
                      <strong className="modal-example-code">{sample.error_code}</strong>
                      <p className="modal-example-desc">{sample.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn modal-close"
                type="button"
                onClick={() => setInfoOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Shortcut({ onTrigger }) {
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") onTrigger();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onTrigger]);
  return null;
}
