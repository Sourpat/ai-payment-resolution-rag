from fastapi import FastAPI

from backend.routers import admin

app = FastAPI(title="AI Payment Resolution Backend", version="0.1.0")

app.include_router(admin.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
