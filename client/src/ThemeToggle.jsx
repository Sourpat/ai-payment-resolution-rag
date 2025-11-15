import { useCallback, useEffect, useMemo, useState } from "react";

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "auto";
    }
    return localStorage.getItem("theme") || "auto";
  });

  const mediaQueryList = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return window.matchMedia(DARK_MEDIA_QUERY);
  }, []);

  const applyTheme = useCallback((mode) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const resolved = mode === "auto" ? getSystemTheme() : mode;

    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", mode);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [applyTheme, theme]);

  useEffect(() => {
    if (!mediaQueryList || theme !== "auto") {
      return;
    }

    const handleChange = () => {
      applyTheme("auto");
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [mediaQueryList, theme, applyTheme]);

  return (
    <div className="theme-toggle" role="group" aria-label="Toggle color theme">
      <button
        type="button"
        className={theme === "light" ? "active" : ""}
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Use light theme"
      >
        🌞
      </button>

      <button
        type="button"
        className={theme === "dark" ? "active" : ""}
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Use dark theme"
      >
        🌙
      </button>

      <button
        type="button"
        className={theme === "auto" ? "active" : ""}
        onClick={() => setTheme("auto")}
        aria-pressed={theme === "auto"}
        aria-label="Follow system theme"
      >
        🖥️
      </button>
    </div>
  );
}
