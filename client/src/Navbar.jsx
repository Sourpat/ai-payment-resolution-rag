import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <nav className="navbar">

        {/* Left Section */}
        <div className="nav-left" onClick={() => (window.location.href = "/")}>
          <span className="nav-logo">⚡</span>
          <span className="nav-title">AI Payment Resolution Assistant</span>
        </div>

        {/* Right Section */}
        <div className="nav-right">

          <a href="/about" className="nav-link">
            About
          </a>

          <ThemeToggle />

          <div className="api-status">
            <span
              className={`status-dot ${
                window.__API_STATUS__ ? "online" : "offline"
              }`}
            ></span>
          </div>

          <a
            href="https://github.com/Sourpat/ai-payment-resolution-rag"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link github-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 .198a8 8 0 00-2.528 15.598c.4.074.546-.174.546-.385v-1.36c-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.727-.497.055-.487.055-.487.803.057 1.226.825 1.226.825.715 1.224 1.874.87 2.33.665.072-.52.28-.87.508-1.07-1.777-.202-3.644-.889-3.644-3.956 0-.874.312-1.588.824-2.148-.083-.203-.357-1.02.078-2.124 0 0 .67-.215 2.2.82a7.544 7.544 0 012.003-.269 7.55 7.55 0 012.003.27c1.53-1.036 2.198-.82 2.198-.82.437 1.104.163 1.921.08 2.123.513.56.823 1.274.823 2.148 0 3.077-1.87 3.752-3.652 3.951.288.25.544.743.544 1.497v2.22c0 .213.143.462.55.384A8.001 8.001 0 008 .196z" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
