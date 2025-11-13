# src/ml/model.py
from pathlib import Path
import joblib
import numpy as np

def load_model(path: str | Path):
    """Load the saved ML pipeline"""
    return joblib.load(str(path))

def predict_category(pipeline, text: str):
    """Return (predicted_category, confidence_score)"""
    proba = pipeline.predict_proba([text])[0]
    idx = int(np.argmax(proba))
    category = pipeline.classes_[idx]
    confidence = float(proba[idx])
    return category, confidence
