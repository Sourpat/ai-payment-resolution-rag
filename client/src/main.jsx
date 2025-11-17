import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import About from "./About.jsx";
import NotFound from "./NotFound.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          }
        />

        {/* About Page */}
        <Route
          path="/about"
          element={
            <ErrorBoundary>
              <About />
            </ErrorBoundary>
          }
        />

        {/* Catch-all 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
