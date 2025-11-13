# src/rag/responder.py

import os
from dotenv import load_dotenv

# Make OpenAI optional: if import fails or no key, we fall back gracefully.
try:
    from openai import OpenAI  # openai >= 1.x
except Exception:
    OpenAI = None  # type: ignore

load_dotenv()

class Responder:
    @staticmethod
    def _fallback_response(query: str, snippets: list[str]) -> str:
        """
        LLM-free fallback: summarize the top snippets concisely.
        Keeps your API running even without the openai package or API key.
        """
        if not snippets:
            return f"Summary for: {query}\n\nNo snippets available. Please provide more context or logs."

        # Take the first few snippets and trim them so the reply stays concise.
        take = min(3, len(snippets))
        trimmed = []
        for s in snippets[:take]:
            s = (s or "").strip()
            if len(s) > 400:
                s = s[:400].rstrip() + " ..."
            trimmed.append(s)

        bullets = "\n".join(f"- {t}" for t in trimmed)
        return (
            f"Summary for: {query}\n\n"
            f"Key points from available support snippets:\n{bullets}\n\n"
            "Next steps:\n"
            "- Verify relevant configuration and credentials for the failing component.\n"
            "- Reproduce with the same inputs; collect logs/correlation IDs.\n"
            "- If a gateway or upstream is involved, check recent changes and retry policy."
        )

    @staticmethod
    def generate_response(query: str, snippets: list[str]) -> str:
        """
        Original signature preserved. Uses OpenAI if available,
        otherwise falls back to a local synthesis.
        """
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        api_key = os.getenv("OPENAI_API_KEY", "")

        # If OpenAI isn't importable or no key is set, return fallback text.
        if not OpenAI or not api_key:
            return Responder._fallback_response(query, snippets)

        try:
            # Both styles work in openai>=1.x; pass key explicitly to stay explicit.
            client = OpenAI(api_key=api_key)

            prompt = (
                "You are a precise support assistant. "
                "Given an error/query and relevant support snippets, produce a concise, actionable response. "
                "Use bullet points, avoid fluff, and call out concrete checks/fixes.\n\n"
                f"User query:\n{query}\n\n"
                "Relevant support snippets:\n"
            )
            for i, snippet in enumerate(snippets or [], start=1):
                clean = (snippet or "").strip()
                if len(clean) > 800:
                    clean = clean[:800].rstrip() + " ..."
                prompt += f"{i}. {clean}\n"
            prompt += (
                "\nNow provide the best possible short, actionable response for the user. "
                "If data is missing, say what to collect next."
            )

            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a support assistant that writes crisp, step-by-step guidance."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
            )
            content = (resp.choices[0].message.content or "").strip()
            return content if content else Responder._fallback_response(query, snippets)

        except Exception:
            # Any API hiccup falls back to a deterministic local summary.
            return Responder._fallback_response(query, snippets)

    def generate(
        self,
        error_code: str,
        category: str,
        severity: str,
        signals: list[str],
        steps: list[str],
        references: list[str],
        message: str,
        trace: str,
        context: dict,
    ) -> dict:
        """
        Adapter so main.py can call responder.generate(...).
        We reuse your generate_response(query, snippets) internally.
        """
        # Build a compact query for your LLM/fallback
        query = f"[{category}/{severity}] {error_code} :: {message or 'No message'}"

        # Reuse steps + refs as the snippets
        snippets: list[str] = []
        if steps:
            snippets.append("Suggested Steps:\n- " + "\n- ".join(steps))
        if references:
            snippets.append("References:\n- " + "\n- ".join(references))

        # Use your existing method (LLM or fallback)
        _ = self.generate_response(query=query, snippets=snippets)

        # Return the structure expected by DiagnoseResponse
        return {
            "detected_error": error_code,
            "category": category,
            "severity": severity,
            "signals": signals,
            "suggested_steps": steps,
            "references": references,
            "raw_notes": f"query={query}\nsteps={len(steps)} refs={len(references)}",
        }
