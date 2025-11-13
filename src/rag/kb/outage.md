# Gateway Timeout / Outage Procedures
**Category**: NETWORK_OR_TIMEOUT / SYSTEM_OUTAGE

**Agent Steps**:
1) Check provider status page
2) Backoff and retry after 60s (max 3)
3) If 503 persists, open ticket and fail fast
