"""MemFOC demo FastAPI server — localhost dashboard API."""

from __future__ import annotations

import asyncio
import json
import os
import time
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from memfoc.store import FilecoinStore

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / ".memfoc"
DATA_DIR.mkdir(exist_ok=True)

ws_clients: set[WebSocket] = set()


def broadcast(event: dict[str, Any]) -> None:
    payload = json.dumps(event)
    dead: list[WebSocket] = []
    for ws in list(ws_clients):
        try:
            asyncio.create_task(ws.send_text(payload))
        except Exception:
            dead.append(ws)
    for ws in dead:
        ws_clients.discard(ws)


store = FilecoinStore(
    db_path=str(DATA_DIR / "index.db"),
    storage_dir=str(DATA_DIR / "blobs"),
    on_event=broadcast,
)


class PutMemoryBody(BaseModel):
    namespace: list[str] = Field(..., min_length=1)
    key: str
    value: dict[str, Any]


class AgentRunBody(BaseModel):
    user_id: str = "demo-user"
    message: str


class AssistantChatBody(BaseModel):
    message: str
    section: str | None = None


class DesignReviewBody(BaseModel):
    section: str = "overview"
    viewport_w: int = 0
    viewport_h: int = 0
    screenshot_b64: str | None = None
    api_online: bool = True
    dom: dict[str, Any] | None = None
    polish_active: bool = False


class GrantFullAuditBody(BaseModel):
    api_online: bool = True


@asynccontextmanager
async def lifespan(_: FastAPI):
    await store.setup()
    yield
    await store.aclose()


app = FastAPI(
    title="MemFOC Demo API",
    description="LangGraph memory on Filecoin — localhost prototype",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "memfoc-demo"}


@app.get("/api/stats")
async def stats() -> dict[str, Any]:
    return await store.dashboard_stats()


@app.get("/api/memories")
async def memories() -> list[dict[str, Any]]:
    return await store.list_memories()


@app.post("/api/memories")
async def put_memory(body: PutMemoryBody) -> dict[str, Any]:
    from langgraph.store.base import PutOp

    ns = tuple(body.namespace)
    await store.abatch([PutOp(ns, body.key, body.value)])
    row = await store.index.get(ns, body.key)
    return {
        "namespace": body.namespace,
        "key": body.key,
        "sync_status": row.sync_status if row else "pending",
    }


@app.delete("/api/memories")
async def delete_memory(namespace: str, key: str) -> dict[str, bool]:
    from langgraph.store.base import PutOp

    ns = tuple(json.loads(namespace))
    result = await store.abatch([PutOp(ns, key, None)])
    return {"deleted": bool(result[0])}


@app.get("/api/sync-log")
async def sync_log(limit: int = 40) -> list[dict[str, Any]]:
    return await store.sync_log(limit)


@app.post("/api/manifest/flush")
async def manifest_flush() -> dict[str, Any]:
    return await store.flush_manifest()


@app.post("/api/index/rebuild")
async def index_rebuild() -> dict[str, int]:
    count = await store.rebuild_index()
    return {"rebuilt": count}


@app.post("/api/benchmark")
async def benchmark() -> dict[str, Any]:
    from langgraph.store.base import GetOp, PutOp

    sizes = {"1kb": 1024, "10kb": 10 * 1024, "100kb": 100 * 1024}
    results: dict[str, Any] = {}

    for label, nbytes in sizes.items():
        payload = {"blob": "x" * nbytes, "label": label}
        ns = ("benchmark",)
        key = f"run-{int(time.time() * 1000)}-{label}"

        t0 = time.perf_counter()
        await store.abatch([PutOp(ns, key, payload)])
        write_ms = (time.perf_counter() - t0) * 1000

        t1 = time.perf_counter()
        await store.abatch([GetOp(ns, key)])
        read_ms = (time.perf_counter() - t1) * 1000

        row = await store.index.get(ns, key)
        sync_ms = None
        if row and row.sync_status == "pending":
            t2 = time.perf_counter()
            await store._worker.sync_one(ns, key, payload)
            sync_ms = (time.perf_counter() - t2) * 1000

        results[label] = {
            "local_write_ms": round(write_ms, 2),
            "local_read_ms": round(read_ms, 2),
            "foc_sync_ms": round(sync_ms, 2) if sync_ms else None,
            "cid": row.cid if row else None,
        }

    broadcast({"type": "benchmark_complete", "results": results})
    return results


@app.post("/api/agent/run")
async def agent_run(body: AgentRunBody) -> dict[str, Any]:
    from langgraph.store.base import GetOp, PutOp, SearchOp

    user_id = body.user_id
    message = body.message.strip()
    if not message:
        return {"reply": "Send a non-empty message.", "memories_used": 0}

    msg_key = f"turn-{int(time.time() * 1000)}"
    await store.abatch(
        [
            PutOp(
                ("users", user_id, "conversation"),
                msg_key,
                {"role": "user", "text": message},
            )
        ]
    )

    if message.lower().startswith("remember theme "):
        theme = message.split("remember theme ", 1)[1].strip()
        await store.abatch(
            [
                PutOp(
                    ("users", user_id, "preferences"),
                    "theme",
                    {"value": theme},
                )
            ]
        )
        reply = f"Preference stored. Theme set to '{theme}' (syncing to Filecoin)."
    elif message.lower() == "what is my theme?":
        items = await store.abatch(
            [GetOp(("users", user_id, "preferences"), "theme")]
        )
        item = items[0]
        if item:
            reply = f"Your saved theme is '{item.value.get('value')}' (CID-backed memory)."
        else:
            reply = "No theme saved yet. Try: remember theme dark"
    else:
        history = await store.abatch(
            [
                SearchOp(
                    ("users", user_id, "conversation"),
                    limit=5,
                )
            ]
        )
        count = len(history[0]) if history and history[0] else 0
        await store.abatch(
            [
                PutOp(
                    ("agents", "memfoc-demo"),
                    msg_key,
                    {"summary": message[:120], "turns_seen": count + 1},
                )
            ]
        )
        reply = (
            f"Logged your message to verifiable memory. "
            f"I see {count} prior turn(s) in namespace users/{user_id}/conversation."
        )

    return {"reply": reply, "user_id": user_id}


@app.post("/api/assistant/chat")
async def assistant_chat(body: AssistantChatBody) -> dict[str, Any]:
    from demo.server.assistants import assistant_reply

    return assistant_reply(body.message, body.section)


@app.post("/api/design-review")
async def design_review_endpoint(body: DesignReviewBody) -> dict[str, Any]:
    from demo.server.grant_optimizer import grant_optimizer_analyze

    return grant_optimizer_analyze(
        section=body.section,
        viewport_w=body.viewport_w,
        viewport_h=body.viewport_h,
        has_screenshot=bool(body.screenshot_b64),
        api_online=body.api_online,
        dom=body.dom,
        polish_active=body.polish_active,
    )


@app.post("/api/grant-optimizer/full-audit")
async def grant_full_audit(body: GrantFullAuditBody) -> dict[str, Any]:
    from demo.server.grant_optimizer import grant_optimizer_full_audit

    return grant_optimizer_full_audit(api_online=body.api_online)


@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket) -> None:
    await websocket.accept()
    ws_clients.add(websocket)
    try:
        await websocket.send_json({"type": "connected", "backend": "MockFOCBackend"})
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_clients.discard(websocket)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "demo.server.main:app",
        host="127.0.0.1",
        port=8787,
        reload=True,
        reload_dirs=[str(ROOT / "demo"), str(ROOT / "src")],
    )
