import Navbar from "./Navbar.jsx";
import "./About.css";
import { sampleTestCases } from "./data/sampleTestCases.js";

export default function About() {
  const categories = Array.from(new Set(sampleTestCases.map((c) => c.category)));
  const curatedExamples = sampleTestCases.slice(0, 4);

  return (
    <>
      <Navbar />

      <div className="about-wrap">
        <section className="about-hero">
          <div className="about-hero-text">
            <p className="eyebrow">Payments reliability</p>
            <h1>About the AI Payment Resolution Assistant</h1>
            <p className="lede">
              A modern incident companion for payment teams. Built to translate noisy gateway
              payloads into concise, trustworthy steps your on-call engineers can execute without
              hunting through runbooks.
            </p>
            <div className="hero-pills">
              <span className="pill">Rules + RAG pipeline</span>
              <span className="pill">Human-friendly summaries</span>
              <span className="pill">Day & Night themes</span>
            </div>
          </div>

          <div className="hero-card">
            <h3>Coverage snapshot</h3>
            <ul className="stat-list">
              {categories.map((category) => (
                <li key={category}>
                  <strong>{category}</strong>
                  <span>included in curated test library</span>
                </li>
              ))}
            </ul>
            <div className="stat-footer">7+ ready-to-run scenarios that mirror real outages.</div>
          </div>
        </section>

        <section className="about-how">
          <div className="section-header">
            <p className="eyebrow">How it works</p>
            <h2>Designed to feel intentional and clear</h2>
            <p className="lede">
              The assistant stitches together deterministic classifiers, semantic retrieval, and LLM
              summarization so you get both precision and context.
            </p>
          </div>

          <div className="how-grid">
            <div className="how-card">
              <span className="how-icon">🛰️</span>
              <h3>Signal intake</h3>
              <p>Ingests PSP payloads, trace IDs, and merchant hints without format friction.</p>
            </div>
            <div className="how-card">
              <span className="how-icon">🧭</span>
              <h3>Rule-first classification</h3>
              <p>Applies curated rules to tag category, severity, and high-confidence signals.</p>
            </div>
            <div className="how-card">
              <span className="how-icon">🧠</span>
              <h3>Context retrieval</h3>
              <p>Fetches similar incidents through vector search to reduce hallucinations.</p>
            </div>
            <div className="how-card">
              <span className="how-icon">✨</span>
              <h3>Actionable output</h3>
              <p>Returns concise summaries, suggested steps, and references your team can trust.</p>
            </div>
          </div>

          <div className="flow-card">
            <div className="flow-head">
              <h3>Flow overview</h3>
              <p className="hint">Each stage is transparent so you can audit decisions.</p>
            </div>
            <div className="flow-timeline">
              <div className="flow-step">
                <span className="flow-dot" />
                <div>
                  <strong>Input capture</strong>
                  <p>Raw error codes, messages, and traces are normalized.</p>
                </div>
              </div>
              <div className="flow-step">
                <span className="flow-dot" />
                <div>
                  <strong>Rules layer</strong>
                  <p>Deterministic heuristics identify critical payment patterns.</p>
                </div>
              </div>
              <div className="flow-step">
                <span className="flow-dot" />
                <div>
                  <strong>RAG retrieval</strong>
                  <p>Embeddings surface similar incidents and mitigation guidance.</p>
                </div>
              </div>
              <div className="flow-step">
                <span className="flow-dot" />
                <div>
                  <strong>LLM synthesis</strong>
                  <p>Summaries, steps, and references are packaged for handoff.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-examples">
          <div className="section-header">
            <p className="eyebrow">Sample incidents</p>
            <h2>Real-world test cases baked in</h2>
            <p className="lede">
              Try the built-in cases to see how the assistant responds to card declines, ACH returns,
              JDE timeouts, and DEA/license issues.
            </p>
          </div>

          <div className="example-grid">
            {curatedExamples.map((example) => (
              <div className="example-card" key={example.id}>
                <div className="example-meta">
                  <span className="pill pill-ghost">{example.category}</span>
                  <strong>{example.error_code}</strong>
                </div>
                <p>{example.message}</p>
                <div className="trace-preview">
                  <span className="hint">Trace snippet</span>
                  <code>{example.trace.split("\n")[0]}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-tech">
          <div className="section-header">
            <p className="eyebrow">Built for production teams</p>
            <h2>Architecture that matches the UI polish</h2>
            <p className="lede">
              Everything is wired for observability and fast iteration—front to back.
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-item">⚛️ React + Vite with theme-aware styling</div>
            <div className="tech-item">🐍 FastAPI for diagnostics endpoints</div>
            <div className="tech-item">🧮 OpenAI embeddings + RAG vector search</div>
            <div className="tech-item">🔄 Deterministic rules to reduce drift</div>
            <div className="tech-item">☁️ Vercel frontend, Render backend</div>
            <div className="tech-item">📈 Status-aware navbar and API health</div>
          </div>
        </section>

        <section className="about-footer-card">
          <div>
            <h3>Built by Sourabh Patil</h3>
            <p>
              Designed for real-world payment operations to showcase how RAG, rules, and UX come
              together for faster resolutions.
            </p>
            <a href="https://github.com/Sourpat" target="_blank" rel="noopener noreferrer">
              Visit GitHub →
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
