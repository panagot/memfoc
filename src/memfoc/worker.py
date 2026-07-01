from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import secrets
from datetime import datetime, timezone
from typing import Any, Callable

from memfoc.backend.base import MockFOCBackend, StorageBackend
from memfoc.index import MemoryIndex

logger = logging.getLogger(__name__)

EventCallback = Callable[[dict[str, Any]], None]


class SyncWorker:
    """Background worker: SQLite pending rows -> FOC upload -> synced."""

    def __init__(
        self,
        index: MemoryIndex,
        backend: StorageBackend,
        *,
        on_event: EventCallback | None = None,
        poll_interval: float = 0.5,
    ) -> None:
        self.index = index
        self.backend = backend
        self.on_event = on_event
        self.poll_interval = poll_interval
        self._task: asyncio.Task[None] | None = None
        self._running = False

    def _emit(self, event: dict[str, Any]) -> None:
        if self.on_event:
            self.on_event(event)

    async def start(self) -> None:
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._loop())

    async def stop(self) -> None:
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    async def sync_one(
        self, namespace: tuple[str, ...], key: str, value: dict[str, Any]
    ) -> str:
        payload = {
            "namespace": list(namespace),
            "key": key,
            "value": value,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._emit(
            {
                "type": "sync_start",
                "namespace": list(namespace),
                "key": key,
            }
        )
        result = await self.backend.upload(payload)
        await self.index.mark_synced(namespace, key, result.cid)
        await self.index.log_sync(
            namespace,
            key,
            "upload",
            cid=result.cid,
            duration_ms=result.duration_ms,
        )
        self._emit(
            {
                "type": "sync_complete",
                "namespace": list(namespace),
                "key": key,
                "cid": result.cid,
                "duration_ms": result.duration_ms,
            }
        )
        return result.cid

    async def _loop(self) -> None:
        while self._running:
            pending = await self.index.list_pending(limit=20)
            for row in pending:
                try:
                    await self.sync_one(row.namespace, row.key, row.value)
                except Exception as exc:
                    logger.exception("Sync failed for %s/%s", row.namespace, row.key)
                    await self.index.mark_failed(row.namespace, row.key)
                    self._emit(
                        {
                            "type": "sync_error",
                            "namespace": list(row.namespace),
                            "key": row.key,
                            "error": str(exc),
                        }
                    )
            await asyncio.sleep(self.poll_interval)


async def flush_manifest(
    index: MemoryIndex,
    backend: StorageBackend,
    *,
    on_event: EventCallback | None = None,
) -> dict[str, Any]:
    """Build manifest snapshot, upload to FOC, record simulated on-chain anchor."""
    memories = await index.all_memories()
    manifest = {
        "version": 1,
        "item_count": len(memories),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "items": [
            {
                "namespace": list(m.namespace),
                "key": m.key,
                "cid": m.cid,
                "updated_at": m.updated_at.isoformat(),
            }
            for m in memories
            if m.cid
        ],
    }
    result = await backend.upload({"type": "manifest", **manifest})
    manifest_hash = hashlib.sha256(
        json.dumps(manifest, sort_keys=True).encode()
    ).hexdigest()
    tx_hash = f"0x{secrets.token_hex(32)}"
    await index.save_manifest(result.cid, len(manifest["items"]), tx_hash)
    payload = {
        "type": "manifest_committed",
        "manifest_cid": result.cid,
        "manifest_hash": manifest_hash,
        "item_count": len(manifest["items"]),
        "tx_hash": tx_hash,
        "duration_ms": result.duration_ms,
    }
    if on_event:
        on_event(payload)
    return payload
