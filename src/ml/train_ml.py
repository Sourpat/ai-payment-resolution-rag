from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib

from .augment import load_training_examples

CSV_PATH = Path(__file__).resolve().parents[1] / "mappings.csv"
MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "tfidf_lr.joblib"

def main():
    data = load_training_examples(str(CSV_PATH))
    texts = [d["text"] for d in data]
    labels = [d["label"] for d in data]

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    pipe = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
        ("clf", LogisticRegression(max_iter=300, class_weight="balanced")),
    ])

    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"holdout accuracy: {acc:.3f}")
    print(classification_report(y_test, preds))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipe, str(MODEL_PATH))
    print(f"wrote model to {MODEL_PATH}")

if __name__ == "__main__":
    main()
