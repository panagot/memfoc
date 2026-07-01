#!/usr/bin/env python3
"""
Minimal LangGraph + FilecoinStore example.

Run from repo root:
    pip install -e ".[demo]"
    python examples/minimal_langgraph.py
"""

from __future__ import annotations

import asyncio
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from langgraph.store.base import GetOp, PutOp

from memfoc.store import FilecoinStore


async def main() -> None:
    tmp = Path(tempfile.mkdtemp(prefix="memfoc-example-"))
    store = FilecoinStore(
        db_path=str(tmp / "index.db"),
        storage_dir=str(tmp / "blobs"),
    )
    await store.setup()

    # Direct store usage (same API as PostgresStore)
    await store.abatch(
        [PutOp(("users", "alice"), "theme", {"value": "dark"})]
    )
    item = (await store.abatch([GetOp(("users", "alice"), "theme")]))[0]
    print("Direct put/get:", item.value if item else None)

    # LangGraph graph compiled with FilecoinStore
    from demo.server.agent_graph import build_demo_graph

    graph = build_demo_graph(store)
    result = await graph.ainvoke(
        {
            "message": "remember theme dark",
            "user_id": "alice",
            "reply": "",
        }
    )
    print("Graph reply:", result["reply"])

    result2 = await graph.ainvoke(
        {
            "message": "what is my theme?",
            "user_id": "alice",
            "reply": "",
        }
    )
    print("Graph recall:", result2["reply"])

    await store.aclose()
    print("\nDone — memories synced to", tmp / "blobs")


if __name__ == "__main__":
    asyncio.run(main())
