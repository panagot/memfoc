"""
Vercel entrypoint — bootstrap import paths then expose the FastAPI app.

Vercel bundles the handler from this file; src/ and demo/ are not on PYTHONPATH
by default, so we add them before importing the demo server.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

for path in (str(ROOT), str(SRC)):
    if path not in sys.path:
        sys.path.insert(0, path)

from demo.server.main import app  # noqa: E402

__all__ = ["app"]
