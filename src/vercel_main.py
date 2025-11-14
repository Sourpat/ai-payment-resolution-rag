# src/vercel_main.py

from mangum import Mangum
from src.api.main import app

# Vercel expects a handler named `handler`
handler = Mangum(app)
