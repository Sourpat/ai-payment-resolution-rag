import json, re
from pathlib import Path

KB_DIR = Path("src/rag/kb")
INDEX_DIR = Path("src/rag/index")
INDEX_DIR.mkdir(parents=True, exist_ok=True)

def split_into_chunks(text, max_len=600):
    # simple split on headings/paragraphs; you can refine later
    parts = re.split(r"\n{2,}", text.strip())
    buf, chunks = [], []
    for p in parts:
        if len("\n\n".join(buf + [p])) > max_len and buf:
            chunks.append("\n\n".join(buf))
            buf = [p]
        else:
            buf.append(p)
    if buf:
        chunks.append("\n\n".join(buf))
    return [c.strip() for c in chunks if c.strip()]

def main():
    docs_path = INDEX_DIR / "docs.jsonl"
    chunks_path = INDEX_DIR / "chunks.json"

    all_docs = []
    all_chunks = []

    for md in KB_DIR.glob("*.md"):
        text = md.read_text(encoding="utf-8")
        doc = {
            "id": md.stem,
            "source": str(md),
            "text": text
        }
        all_docs.append(doc)

        for i, chunk in enumerate(split_into_chunks(text)):
            all_chunks.append({
                "doc_id": md.stem,
                "source": str(md),
                "chunk_id": f"{md.stem}#{i}",
                "text": chunk
            })

    with open(docs_path, "w", encoding="utf-8") as f:
        for d in all_docs:
            f.write(json.dumps(d, ensure_ascii=False) + "\n")

    with open(chunks_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)

    print(f"wrote {len(all_docs)} docs → {docs_path}")
    print(f"wrote {len(all_chunks)} chunks → {chunks_path}")

if __name__ == "__main__":
    main()
