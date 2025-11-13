// client/src/api.js

const API_BASE = import.meta.env.VITE_API_BASE;  // http://127.0.0.1:8000

export async function diagnose(payload) {
  const res = await fetch(`${API_BASE}/support/diagnose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Backend error");
  }

  return res.json();
}
