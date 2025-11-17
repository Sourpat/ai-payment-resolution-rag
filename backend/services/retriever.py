from pathlib import Path
from typing import List, Dict, Any

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# FIX: Use absolute path based on current file
BASE_DIR = Path(__file__).resolve().parent.parent

SEEDS_DIR = BASE_DIR / "seeds"
VECTOR_STORE_PATH = BASE_DIR / "vector_store"

# Ensure these folders exist
SEEDS_DIR.mkdir(exist_ok=True)
VECTOR_STORE_PATH.mkdir(exist_ok=True)


class Retriever:
    """Simple TF-IDF based retriever for seed documents."""

    def __init__(self) -> None:
        self.vectorizer: TfidfVectorizer | None = None
        self.matrix = None
        self.documents: List[Dict[str, Any]] = []
        self.store_file = VECTOR_STORE_PATH / "store.joblib"
        self.load_vector_store()

    def load_seed_documents(self) -> List[Dict[str, str]]:
        documents: List[Dict[str, str]] = []
        for file in SEEDS_DIR.glob("*.*"):
            if file.suffix.lower() in [".txt", ".md"]:
                try:
                    documents.append({"path": str(file.name), "text": file.read_text(encoding="utf-8")})
                except Exception:
                    # Skip unreadable files but continue building the store
                    continue
        return documents

    def rebuild_vector_store(self) -> None:
        try:
            seed_docs = self.load_seed_documents()
            texts = [doc["text"] for doc in seed_docs]

            self.vectorizer = TfidfVectorizer(stop_words="english")
            if texts:
                self.matrix = self.vectorizer.fit_transform(texts)
            else:
                # Handle empty corpus by fitting on a placeholder document
                self.matrix = self.vectorizer.fit_transform([""])
            self.documents = seed_docs
            self.save_vector_store()
        except Exception as e:
            print("VECTOR BUILD ERROR:", str(e))
            raise e

    def save_vector_store(self) -> None:
        payload = {
            "vectorizer": self.vectorizer,
            "matrix": self.matrix,
            "documents": self.documents,
        }
        joblib.dump(payload, self.store_file)

    def load_vector_store(self) -> None:
        if not self.store_file.exists():
            self.rebuild_vector_store()
            return

        try:
            payload = joblib.load(self.store_file)
            self.vectorizer = payload.get("vectorizer")
            self.matrix = payload.get("matrix")
            self.documents = payload.get("documents", [])
        except Exception:
            self.rebuild_vector_store()

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if self.vectorizer is None or self.matrix is None:
            self.load_vector_store()

        if not query.strip() or self.matrix is None:
            return []

        query_vec = self.vectorizer.transform([query])
        scores = linear_kernel(query_vec, self.matrix).flatten()
        top_indices = scores.argsort()[::-1][:top_k]

        results: List[Dict[str, Any]] = []
        for idx in top_indices:
            if idx < len(self.documents):
                results.append(
                    {
                        "path": self.documents[idx].get("path", ""),
                        "text": self.documents[idx].get("text", ""),
                        "score": float(scores[idx]),
                    }
                )
        return results
