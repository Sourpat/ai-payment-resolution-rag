import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "auto";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function applyTheme(mode) {
    const root = document.documentElement;

    if (mode === "light") {
      root.dataset.theme = "light";
    } else if (mode === "dark") {
      root.dataset.theme = "dark";
    } else {
      root.dataset.theme = "auto";
    }

    localStorage.setItem("theme", mode);
  }

  return (
    <div className="theme-toggle">
      <button
        className={theme === "light" ? "active" : ""}
        onClick={() => setTheme("light")}
      >
        🌞
      </button>

      <button
        className={theme === "dark" ? "active" : ""}
        onClick={() => setTheme("dark")}
      >
        🌙
      </button>

      <button
        className={theme === "auto" ? "active" : ""}
        onClick={() => setTheme("auto")}
      >
        🖥️
      </button>
    </div>
  );
}
