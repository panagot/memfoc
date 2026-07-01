from __future__ import annotations

import asyncio
from typing import Any, Iterable

from langgraph.store.base import (
    BaseStore,
    GetOp,
    Item,
    ListNamespacesOp,
    Op,
    PutOp,
    Result,
    SearchItem,
    SearchOp,
)

from memfoc.backend.base import MockFOCBackend, StorageBackend
from memfoc.index import MemoryIndex
from memfoc.worker import SyncWorker, flush_manifest


class FilecoinStore(BaseStore):
    """
    LangGraph BaseStore with immediate SQLite reads and async FOC durability.

    Localhost default uses MockFOCBackend (content-addressed blobs on disk).
    """

    def __init__(
        self,
        db_path: str = ".memfoc/index.db",
        storage_dir: str = ".memfoc/blobs",
        *,
        backend: StorageBackend | None = None,
        auto_sync: bool = True,
        on_event: Any | None = None,
    ) -> None:
        self.index = MemoryIndex(db_path)
        self.backend = backend or MockFOCBackend(storage_dir)
        self.auto_sync = auto_sync
        self.on_event = on_event
        self._worker = SyncWorker(self.index, self.backend, on_event=on_event)
        self._started = False
        self._setup_lock = asyncio.Lock()

    async def setup(self) -> None:
        async with self._setup_lock:
            await self.index.setup()
            if self.auto_sync and not self._started:
                await self._worker.start()
                self._started = True

    async def aclose(self) -> None:
        await self._worker.stop()

    def batch(self, ops: Iterable[Op]) -> list[Result]:
        return asyncio.run(self.abatch(ops))

    async def abatch(self, ops: Iterable[Op]) -> list[Result]:
        await self.setup()
        results: list[Result] = []
        for op in ops:
            if isinstance(op, GetOp):
                row = await self.index.get(op.namespace, op.key)
                if row is None:
                    results.append(None)
                else:
                    results.append(
                        Item(
                            value=row.value,
                            key=row.key,
                            namespace=row.namespace,
                            created_at=row.created_at,
                            updated_at=row.updated_at,
                        )
                    )
            elif isinstance(op, PutOp):
                if op.value is None:
                    deleted = await self.index.delete(op.namespace, op.key)
                    results.append(deleted)
                else:
                    await self.index.put(
                        op.namespace, op.key, op.value, sync_status="pending"
                    )
                    if self.auto_sync:
                        asyncio.create_task(
                            self._worker.sync_one(op.namespace, op.key, op.value)
                        )
                    results.append(None)
            elif isinstance(op, SearchOp):
                if op.query:
                    raise NotImplementedError(
                        "Semantic search requires embedding plugin (v1.1)"
                    )
                rows = await self.index.search(
                    op.namespace_prefix,
                    filter=op.filter,
                    limit=op.limit,
                    offset=op.offset,
                )
                results.append(
                    [
                        SearchItem(
                            namespace=r.namespace,
                            key=r.key,
                            value=r.value,
                            created_at=r.created_at,
                            updated_at=r.updated_at,
                        )
                        for r in rows
                    ]
                )
            elif isinstance(op, ListNamespacesOp):
                prefix_ns: tuple[str, ...] | None = None
                suffix_ns: tuple[str, ...] | None = None
                if op.match_conditions:
                    for cond in op.match_conditions:
                        if cond.match_type == "prefix":
                            prefix_ns = tuple(cond.path)
                        elif cond.match_type == "suffix":
                            suffix_ns = tuple(cond.path)
                ns_list = await self.index.list_namespaces(
                    prefix=prefix_ns,
                    suffix=suffix_ns,
                    max_depth=op.max_depth,
                    limit=op.limit,
                    offset=op.offset,
                )
                results.append(ns_list)
            else:
                raise ValueError(f"Unsupported op: {op!r}")
        return results

    async def flush_manifest(self) -> dict[str, Any]:
        await self.setup()
        return await flush_manifest(self.index, self.backend, on_event=self.on_event)

    async def rebuild_index(self) -> int:
        """Disaster recovery: re-index from latest manifest blob on FOC."""
        await self.setup()
        manifest_row = await self.index.latest_manifest()
        if not manifest_row:
            return 0
        blob = await self.backend.download(manifest_row["manifest_cid"])
        count = 0
        for item in blob.get("items", []):
            ns = tuple(item["namespace"])
            key = item["key"]
            cid = item["cid"]
            if not cid:
                continue
            payload = await self.backend.download(cid)
            await self.index.put(
                ns,
                key,
                payload["value"],
                sync_status="synced",
                cid=cid,
            )
            count += 1
        return count

    async def dashboard_stats(self) -> dict[str, Any]:
        await self.setup()
        stats = await self.index.stats()
        manifest = await self.index.latest_manifest()
        return {
            **stats,
            "latest_manifest": manifest,
            "backend": type(self.backend).__name__,
        }

    async def list_memories(self) -> list[dict[str, Any]]:
        await self.setup()
        rows = await self.index.all_memories()
        return [
            {
                "namespace": list(r.namespace),
                "key": r.key,
                "value": r.value,
                "cid": r.cid,
                "sync_status": r.sync_status,
                "created_at": r.created_at.isoformat(),
                "updated_at": r.updated_at.isoformat(),
            }
            for r in rows
        ]

    async def sync_log(self, limit: int = 50) -> list[dict[str, Any]]:
        await self.setup()
        return await self.index.sync_log_entries(limit)
