"""
Vercel entrypoint — bootstrap import paths then expose the FastAPI app.
"""

from __future__ import annotations

import sys
import traceback
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

for path in (str(ROOT), str(SRC)):
    if path not in sys.path:
        sys.path.insert(0, path)

try:
    from demo.server.main import app as _app

    app = _app
except Exception:
    # Fallback so /api/health returns a diagnostic instead of a hard crash
    from fastapi import FastAPI

    _error = traceback.format_exc()
    app = FastAPI(title="MemFOC Demo API (degraded)")

    @app.get("/api/health")
    async def degraded_health() -> dict[str, str]:
        return {"status": "error", "detail": "Import failed — check Vercel logs"}

    @app.get("/api/_error")
    async def import_error() -> dict[str, str]:
        return {"traceback": _error}

__all__ = ["app"]
