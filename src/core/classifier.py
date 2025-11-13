# src/core/classifier.py
from __future__ import annotations
from typing import Tuple, List, Optional
import json
from pathlib import Path

_DEFAULT_RULES = {
    "Payments": {
        "match_any": ["PAYMENT", "CARD"],
        "severity": "High",
        "signals": ["payment_module", "cc_validation", "gateway_response"],
    },
    "Auth": {
        "match_any": ["AUTH", "UNAUTHORIZED", "401"],
        "severity": "Medium",
        "signals": ["token_expired", "bad_credentials"],
    },
    "Networking": {
        "match_any": ["TIMEOUT", "TIMED OUT"],
        "severity": "Medium",
        "signals": ["upstream_timeout", "retry_needed"],
    },
    "Routing": {
        "match_any": ["NOT FOUND", "404"],
        "severity": "Low",
        "signals": ["missing_endpoint", "bad_url"],
    },
    "General": {
        "match_any": [],
        "severity": "Low",
        "signals": ["generic_checklist"],
    },
}

class RulesClassifier:
    def __init__(self, mappings_path: Optional[str] = None):
        """
        If mappings_path is provided and exists, load JSON rules from it.
        Otherwise, use built-in defaults so the app can still run.
        """
        self.rules = _DEFAULT_RULES
        if mappings_path:
            p = Path(mappings_path)
            if p.exists():
                try:
                    self.rules = json.loads(p.read_text(encoding="utf-8"))
                except Exception:
                    # If the file is bad, continue with defaults
                    self.rules = _DEFAULT_RULES

    def classify(self, error_code: str, message: str, trace: str) -> Tuple[str, str, List[str]]:
        code = (error_code or "").upper().strip()
        msg = (message or "").upper()
        # Simple rule: first matching bucket wins
        for bucket, spec in self.rules.items():
            triggers = [t.upper() for t in spec.get("match_any", [])]
            if any(t in code or t in msg for t in triggers):
                return (
                    bucket,
                    spec.get("severity", "Low"),
                    spec.get("signals", ["generic_checklist"]),
                )
        # Fallback
        spec = self.rules["General"]
        return ("General", spec.get("severity", "Low"), spec.get("signals", ["generic_checklist"]))
