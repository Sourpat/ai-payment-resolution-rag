import Navbar from "./Navbar.jsx";
import "./About.css";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="about-wrap">

        {/* Hero */}
        <section className="about-hero">
          <h1>About This Project</h1>
          <p>
            The <strong>AI Payment Resolution Assistant</strong> helps engineers, support teams,
            and analysts quickly diagnose complex payment errors using a hybrid
            <strong> RAG (Retrieval-Augmented Generation)</strong> + rules-based engine.
          </p>
        </section>

        {/* Feature Cards */}
        <section className="about-features">
          <h2>What This App Does</h2>

          <div className="features-grid">
            
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Fast Error Diagnosis</h3>
              <p>
                Automatically identifies payment issues, root causes, and next steps
                based on real-world signal patterns.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h3>RAG-Powered Insights</h3>
              <p>
                Uses vector search over curated knowledge to enhance accuracy beyond LLM reasoning.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🧠</span>
              <h3>Rule Engine + AI Combination</h3>
              <p>
                A lightweight rules classifier works alongside AI to deliver consistent, stable results.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <h3>Clear Interpretability</h3>
              <p>
                Shows signals, categories, suggested steps, references, and raw diagnostic notes.
              </p>
            </div>

          </div>
        </section>

        {/* Architecture */}
        <section className="about-architecture">
          <h2>How It Works</h2>

          <div className="architecture-box">
            <pre>
{`
User Input
    │
    ▼
Rules Classifier (Python)
    │
    ├─ Detects category & severity
    └─ Identifies key signals
    │
    ▼
RAG Retriever
    │
    ├─ Vector embeddings (text-embedding-3-large)
    ├─ Semantic search over knowledge base
    └─ Context assembly
    │
    ▼
OpenAI gpt-4.1-mini
    │
    ├─ Generates concise fix summary
    ├─ Suggested steps
    └─ Reference notes
    │
    ▼
Final AI-Assisted Diagnosis
`}
            </pre>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="about-tech">
          <h2>Tech Stack</h2>

          <div className="tech-grid">
            <div className="tech-item">⚛️ React + Vite</div>
            <div className="tech-item">🐍 FastAPI</div>
            <div className="tech-item">🧮 OpenAI Embeddings</div>
            <div className="tech-item">🔎 RAG Vector Search</div>
            <div className="tech-item">☁️ Vercel (Frontend)</div>
            <div className="tech-item">🧩 Render (Backend)</div>
          </div>
        </section>

        {/* Footer Card */}
        <section className="about-footer-card">
          <h3>Built by Sourabh Patil</h3>
          <p>
            Designed as a real-world engineering tool to demonstrate RAG,
            payment systems debugging, and full-stack architecture.
          </p>
          <a
            href="https://github.com/Sourpat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GitHub →
          </a>
        </section>

      </div>
    </>
  );
}
