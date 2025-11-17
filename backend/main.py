from fastapi import FastAPI

from backend.routers import admin, debug

app = FastAPI(title="AI Payment Resolution Backend", version="0.1.0")

app.include_router(admin.router)
app.include_router(debug.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
