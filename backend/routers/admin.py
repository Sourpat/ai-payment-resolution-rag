from fastapi import APIRouter

from backend.services.retriever import Retriever

router = APIRouter(prefix="/admin", tags=["admin"])
retriever = Retriever()


@router.post("/rebuild-vector-store")
def rebuild_vector_store():
    retriever.rebuild_vector_store()
    return {"status": "rebuilt"}
