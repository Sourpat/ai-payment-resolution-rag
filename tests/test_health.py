
import asyncio

from httpx import AsyncClient, ASGITransport

from src.api.main import app


def test_support_health():
    async def _call_health():
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            return await ac.get("/support/health")

    resp = asyncio.run(_call_health())

    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
