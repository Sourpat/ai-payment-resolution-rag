from fastapi import APIRouter
from pathlib import Path

router = APIRouter()

@router.get("/debug/vector-store")
def debug_vector_store():
    path = Path(__file__).resolve().parent.parent / "vector_store" / "seed_vectors.json"
    
    if not path.exists():
        return {"exists": False, "message": "seed_vectors.json NOT FOUND"}
    
    size = path.stat().st_size
    return {
        "exists": True,
        "size_bytes": size,
        "path": str(path)
    }
