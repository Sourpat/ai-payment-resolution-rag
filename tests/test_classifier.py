
from pathlib import Path

from src.core.classifier import RulesClassifier


def _clf() -> RulesClassifier:
    """Helper to load the real rules file shipped with the API."""

    rules_path = Path(__file__).resolve().parents[1] / "config" / "rules.json"
    return RulesClassifier(str(rules_path))


def test_exact_match():
    category, severity, signals = _clf().classify(
        error_code="CARD_EXPIRED", message="", trace=""
    )
    assert category == "Payments"
    assert severity == "High"
    assert "gateway_response" in signals


def test_message_match():
    category, severity, signals = _clf().classify(
        error_code="", message="the card looks expired", trace=""
    )
    assert category == "Payments"
    assert severity == "High"
    assert "payment_module" in signals


def test_unknown_falls_back_to_general():
    category, severity, signals = _clf().classify(
        error_code="", message="some totally new error", trace=""
    )
    assert category == "General"
    assert severity == "Low"
    assert signals == ["generic_checklist"]
