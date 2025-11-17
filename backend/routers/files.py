from fastapi import APIRouter
from pathlib import Path

router = APIRouter()


@router.get("/debug/list-files")
def list_all_files():
    base = Path("/opt/render/project/src")
    files = [str(p) for p in base.rglob("*seed_vectors.json")]
    return {"files_found": files}
