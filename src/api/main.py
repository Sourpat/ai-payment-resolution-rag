# src/api/main.py
from __future__ import annotations

import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.core.classifier import RulesClassifier
from src.rag.retriever import RAG
from src.rag.responder import Responder

from src.api.logger import log_event

load_dotenv()

app = FastAPI(title="Dev Support RAG API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# MODELS
# ---------------------------
class DiagnoseRequest(BaseModel):
    error_code: str = Field(..., examples=["PAYMENT_METHOD_ERROR"])
    message: Optional[str] = None
    trace: Optional[str] = Field(None, max_length=20000)
    context: Optional[Dict[str, Any]] = None


class DiagnoseResponse(BaseModel):
    detected_error: str
    category: str
    severity: str
    signals: List[str]
    suggested_steps: List[str]
    references: List[str]
    raw_notes: Optional[str] = None
    assistant_summary: Optional[str] = None


# ---------------------------
# SINGLETON COMPONENTS
# ---------------------------
ROOT_DIR = Path(__file__).resolve().parents[2]
RULES_PATH = ROOT_DIR / "config" / "rules.json"
KNOWLEDGE_DIR = ROOT_DIR / "knowledge"

classifier = RulesClassifier(str(RULES_PATH))

retriever = RAG(index_dir=str(KNOWLEDGE_DIR))

responder = Responder()


# ---------------------------
# ROUTES
# ---------------------------
@app.get("/support/categories")
def list_categories():
    try:
        return {"categories": list(retriever.playbook.keys())}
    except Exception:
        return {"categories": ["Payments", "Auth", "Networking", "Routing", "General"]}


@app.get("/support/health")
def health():
    """Render-compatible health probe scoped to the /support API."""
    return {"status": "ok"}


@app.get("/support/ping")
def ping():
    log_event("Ping received")
    return {
        "ok": True,
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "has_openai": bool(os.getenv("OPENAI_API_KEY", "")),
        "knowledge_dir": str(KNOWLEDGE_DIR.resolve()),
    }


@app.post("/support/diagnose", response_model=DiagnoseResponse)
def diagnose(req: DiagnoseRequest):
    log_event(f"/diagnose → {req.error_code}")

    if not req.error_code.strip():
        raise HTTPException(status_code=400, detail="error_code is required")

    category, severity, signals = classifier.classify(
        error_code=req.error_code,
        message=req.message or "",
        trace=req.trace or "",
    )

    refs, steps = retriever.retrieve_playbook(
        error_code=req.error_code,
        category=category,
        message=req.message or "",
    )

    base = responder.generate(
        error_code=req.error_code,
        category=category,
        severity=severity,
        signals=signals,
        steps=steps,
        references=refs,
        message=req.message or "",
        trace=req.trace or "",
        context=req.context or {},
    )

    return base


@app.post("/support/diagnose/with-summary", response_model=DiagnoseResponse)
def diagnose_with_summary(req: DiagnoseRequest):
    log_event(f"/diagnose/with-summary → {req.error_code}")

    if not req.error_code.strip():
        raise HTTPException(status_code=400, detail="error_code is required")

    category, severity, signals = classifier.classify(
        error_code=req.error_code,
        message=req.message or "",
        trace=req.trace or "",
    )

    refs, steps = retriever.retrieve_playbook(
        error_code=req.error_code,
        category=category,
        message=req.message or "",
    )

    base = responder.generate(
        error_code=req.error_code,
        category=category,
        severity=severity,
        signals=signals,
        steps=steps,
        references=refs,
        message=req.message or "",
        trace=req.trace or "",
        context=req.context or {},
    )

    query = f"[{category}/{severity}] {req.error_code}: {req.message or 'No message'}"
    snippets = [
        "Steps:\n- " + "\n- ".join(steps),
        "References:\n- " + "\n- ".join(refs),
    ]
    summary = responder.generate_response(query, snippets)

    base["assistant_summary"] = summary
    return base
