
from pathlib import Path
from src.core.classifier import RulesClassifier

def test_exact_match():
    clf = RulesClassifier(str(Path(__file__).resolve().parents[1] / "mappings.csv"))
    res = clf.classify(raw_code="CARD_EXPIRED", raw_message="")
    assert res.category == "PAYMENT_METHOD_ERROR"
    assert res.confidence == 1.0

def test_regex_match():
    clf = RulesClassifier(str(Path(__file__).resolve().parents[1] / "mappings.csv"))
    res = clf.classify(raw_code="", raw_message="the card looks expired")
    assert res.category == "PAYMENT_METHOD_ERROR"
    assert res.confidence >= 0.95

def test_unknown():
    clf = RulesClassifier(str(Path(__file__).resolve().parents[1] / "mappings.csv"))
    res = clf.classify(raw_code="", raw_message="some totally new error")
    assert res.category in ("UNKNOWN",)
