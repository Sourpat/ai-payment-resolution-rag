# src/rag/retriever.py
from __future__ import annotations
from typing import Tuple, List, Optional
from pathlib import Path

# Built-in fallback playbook (works even without any files on disk)
_PLAYBOOK_FALLBACK = {
    "Payments": {
        "refs": [
            "docs/payments/gateway-checks.md",
            "docs/payments/tokenization.md",
            "runbooks/payments/common-failures.md",
        ],
        "steps": [
            "Verify payment method is allowed for the account/location.",
            "Check tokenization response (token present, not expired).",
            "Confirm gateway credentials & merchant config in env.",
            "Validate currency, amount format, and CVV/AVS rules.",
            "Retry once if upstream 5xx; otherwise surface user-safe message.",
        ],
    },
    "Auth": {
        "refs": ["docs/auth/jwt-rotation.md", "runbooks/auth/401-403.md"],
        "steps": [
            "Check Authorization header present and Bearer token format.",
            "Validate token exp/nbf and audience claims.",
            "Confirm server clock skew and refresh token logic.",
        ],
    },
    "Networking": {
        "refs": ["docs/net/retries.md", "runbooks/net/timeouts.md"],
        "steps": [
            "Confirm upstream host resolves and is reachable.",
            "Increase client timeout to >= 30s for heavy operations.",
            "Enable exponential backoff with jitter on retries.",
        ],
    },
    "Routing": {
        "refs": ["docs/api/routing.md"],
        "steps": [
            "Check route path and HTTP method.",
            "Ensure service registering route on startup (import side-effects).",
        ],
    },
    "General": {
        "refs": ["docs/oncall/triage-checklist.md"],
        "steps": [
            "Reproduce locally with same inputs.",
            "Check recent deploys/feature flags.",
            "Collect logs with correlation/request IDs.",
        ],
    },
}

class RAG:
    """
    Simple retriever. If index_dir is provided, we'll try to load category-specific
    files from that folder (optional). Otherwise we use the built-in fallback map.
    """
    def __init__(self, index_dir: Optional[str] = None):
        self.index_dir = Path(index_dir) if index_dir else None
        self.playbook = dict(_PLAYBOOK_FALLBACK)  # start with fallback

        # Optional: load refs/steps from files in index_dir if present
        # Structure (all optional):
        #   <index_dir>/
        #       payments_refs.txt, payments_steps.txt
        #       auth_refs.txt, auth_steps.txt
        #       networking_refs.txt, networking_steps.txt
        #       routing_refs.txt, routing_steps.txt
        #       general_refs.txt, general_steps.txt
        if self.index_dir and self.index_dir.exists():
            self._maybe_load_category("Payments", "payments")
            self._maybe_load_category("Auth", "auth")
            self._maybe_load_category("Networking", "networking")
            self._maybe_load_category("Routing", "routing")
            self._maybe_load_category("General", "general")

    def _maybe_load_category(self, bucket: str, stem: str) -> None:
        refs_path = self.index_dir / f"{stem}_refs.txt"
        steps_path = self.index_dir / f"{stem}_steps.txt"

        refs = self.playbook[bucket]["refs"]
        steps = self.playbook[bucket]["steps"]

        if refs_path.exists():
            try:
                refs = [line.strip() for line in refs_path.read_text(encoding="utf-8").splitlines() if line.strip()]
            except Exception:
                pass
        if steps_path.exists():
            try:
                steps = [line.strip() for line in steps_path.read_text(encoding="utf-8").splitlines() if line.strip()]
            except Exception:
                pass

        self.playbook[bucket] = {"refs": refs, "steps": steps}

    def retrieve_playbook(self, error_code: str, category: str, message: str) -> Tuple[List[str], List[str]]:
        entry = self.playbook.get(category, self.playbook["General"])
        return entry["refs"], entry["steps"]
