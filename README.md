
# AI Payments Error Resolution (MVP - Rules First)

A tiny, runnable starter that classifies payment/ERP error signals via simple rules.

## Quickstart (Windows PowerShell)

```powershell
# 0) Choose a workspace
New-Item -ItemType Directory -Path "C:\Users\sourp\Projects" -ErrorAction SilentlyContinue
cd "C:\Users\sourp\Projects"

# 1) Download and unzip this starter, or clone your GitHub repo here.
# If using this zip, extract it into C:\Users\sourp\Projects\AI-Payments-Resolution

# 2) Create virtual env
py -m venv .venv
.\.venv\Scripts\Activate.ps1

# 3) Install deps
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 4) Run API
uvicorn src.api.main:app --reload

# 5) In another terminal (activate .venv again), run tests
pytest

# 6) Optional: Streamlit demo (keep API running)
streamlit run demo\streamlit_app.py
```

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `POST /classify` with body:
  ```json
  {"raw_code": "CARD_EXPIRED", "raw_message": ""}
  ```

## Where to edit rules

- `mappings.csv` is the source of truth. Add rows for new provider/ERP codes, tweak user messages and agent steps.

## Next steps

- Add ML fallback for UNKNOWNs (TF-IDF + Logistic Regression).
- Add RAG-driven `/recommend` for policy-aware guidance.
- Introduce action proposals and audit logging.
