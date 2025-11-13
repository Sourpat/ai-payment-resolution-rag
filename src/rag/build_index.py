import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

INDEX_DIR = Path("src/rag/index")

def main():
    chunks = json.loads((INDEX_DIR / "chunks.json").read_text(encoding="utf-8"))
    texts = [c["text"] for c in chunks]

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

    np.save(INDEX_DIR / "embeddings.npy", embeddings)
    print(f"wrote embeddings → {INDEX_DIR / 'embeddings.npy'} for {len(texts)} chunks")

if __name__ == "__main__":
    main()
