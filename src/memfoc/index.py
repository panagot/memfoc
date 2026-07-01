from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import aiosqlite


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _dt_iso(dt: datetime) -> str:
    return dt.isoformat()


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value)


@dataclass(slots=True)
class MemoryRow:
    namespace: tuple[str, ...]
    key: str
    value: dict[str, Any]
    cid: str | None
    sync_status: str
    created_at: datetime
    updated_at: datetime


class MemoryIndex:
    """SQLite index for fast LangGraph store reads."""

    def __init__(self, db_path: str) -> None:
        self.db_path = db_path

    async def setup(self) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.executescript(
                """
                CREATE TABLE IF NOT EXISTS memories (
                    namespace TEXT NOT NULL,
                    key TEXT NOT NULL,
                    value TEXT NOT NULL,
                    cid TEXT,
                    sync_status TEXT NOT NULL DEFAULT 'pending',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (namespace, key)
                );
                CREATE INDEX IF NOT EXISTS idx_memories_sync ON memories(sync_status);
                CREATE INDEX IF NOT EXISTS idx_memories_ns ON memories(namespace);

                CREATE TABLE IF NOT EXISTS sync_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    namespace TEXT NOT NULL,
                    key TEXT NOT NULL,
                    action TEXT NOT NULL,
                    cid TEXT,
                    duration_ms REAL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS manifests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    manifest_cid TEXT NOT NULL,
                    item_count INTEGER NOT NULL,
                    tx_hash TEXT,
                    created_at TEXT NOT NULL
                );
                """
            )
            await db.commit()

    @staticmethod
    def _ns_key(namespace: tuple[str, ...]) -> str:
        return json.dumps(list(namespace), separators=(",", ":"))

    @staticmethod
    def _ns_from_key(raw: str) -> tuple[str, ...]:
        return tuple(json.loads(raw))

    def _row_to_memory(self, row: aiosqlite.Row) -> MemoryRow:
        return MemoryRow(
            namespace=self._ns_from_key(row["namespace"]),
            key=row["key"],
            value=json.loads(row["value"]),
            cid=row["cid"],
            sync_status=row["sync_status"],
            created_at=_parse_dt(row["created_at"]),
            updated_at=_parse_dt(row["updated_at"]),
        )

    async def put(
        self,
        namespace: tuple[str, ...],
        key: str,
        value: dict[str, Any],
        *,
        sync_status: str = "pending",
        cid: str | None = None,
    ) -> MemoryRow:
        now = _utcnow()
        ns = self._ns_key(namespace)
        payload = json.dumps(value, separators=(",", ":"))

        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            existing = await db.execute_fetchall(
                "SELECT created_at FROM memories WHERE namespace = ? AND key = ?",
                (ns, key),
            )
            created = existing[0]["created_at"] if existing else _dt_iso(now)
            await db.execute(
                """
                INSERT INTO memories (namespace, key, value, cid, sync_status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(namespace, key) DO UPDATE SET
                    value = excluded.value,
                    cid = COALESCE(excluded.cid, memories.cid),
                    sync_status = excluded.sync_status,
                    updated_at = excluded.updated_at
                """,
                (ns, key, payload, cid, sync_status, created, _dt_iso(now)),
            )
            await db.commit()

        return MemoryRow(
            namespace=namespace,
            key=key,
            value=value,
            cid=cid,
            sync_status=sync_status,
            created_at=_parse_dt(created),
            updated_at=now,
        )

    async def get(self, namespace: tuple[str, ...], key: str) -> MemoryRow | None:
        ns = self._ns_key(namespace)
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                "SELECT * FROM memories WHERE namespace = ? AND key = ?",
                (ns, key),
            )
        if not rows:
            return None
        return self._row_to_memory(rows[0])

    async def delete(self, namespace: tuple[str, ...], key: str) -> bool:
        ns = self._ns_key(namespace)
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "DELETE FROM memories WHERE namespace = ? AND key = ?",
                (ns, key),
            )
            await db.commit()
            return cursor.rowcount > 0

    async def mark_synced(
        self, namespace: tuple[str, ...], key: str, cid: str
    ) -> None:
        ns = self._ns_key(namespace)
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                UPDATE memories
                SET cid = ?, sync_status = 'synced', updated_at = ?
                WHERE namespace = ? AND key = ?
                """,
                (cid, _dt_iso(_utcnow()), ns, key),
            )
            await db.commit()

    async def mark_failed(self, namespace: tuple[str, ...], key: str) -> None:
        ns = self._ns_key(namespace)
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                UPDATE memories SET sync_status = 'failed', updated_at = ?
                WHERE namespace = ? AND key = ?
                """,
                (_dt_iso(_utcnow()), ns, key),
            )
            await db.commit()

    async def list_pending(self, limit: int = 50) -> list[MemoryRow]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                """
                SELECT * FROM memories
                WHERE sync_status IN ('pending', 'failed')
                ORDER BY updated_at ASC
                LIMIT ?
                """,
                (limit,),
            )
        return [self._row_to_memory(r) for r in rows]

    async def search(
        self,
        namespace_prefix: tuple[str, ...],
        *,
        filter: dict[str, Any] | None = None,
        limit: int = 10,
        offset: int = 0,
    ) -> list[MemoryRow]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                "SELECT * FROM memories ORDER BY updated_at DESC"
            )

        prefix = list(namespace_prefix)
        results: list[MemoryRow] = []
        for row in rows:
            memory = self._row_to_memory(row)
            if list(memory.namespace[: len(prefix)]) != prefix:
                continue
            if filter and not _match_filter(memory.value, filter):
                continue
            results.append(memory)

        return results[offset : offset + limit]

    async def list_namespaces(
        self,
        *,
        prefix: tuple[str, ...] | None = None,
        suffix: tuple[str, ...] | None = None,
        max_depth: int | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[tuple[str, ...]]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall("SELECT DISTINCT namespace FROM memories")

        namespaces: set[tuple[str, ...]] = set()
        for row in rows:
            ns = self._ns_from_key(row["namespace"])
            if prefix and list(ns[: len(prefix)]) != list(prefix):
                continue
            if suffix and list(ns[-len(suffix) :]) != list(suffix):
                continue
            if max_depth is not None:
                namespaces.add(ns[:max_depth])
            else:
                namespaces.add(ns)

        ordered = sorted(namespaces)
        return ordered[offset : offset + limit]

    async def all_memories(self) -> list[MemoryRow]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                "SELECT * FROM memories ORDER BY updated_at DESC"
            )
        return [self._row_to_memory(r) for r in rows]

    async def stats(self) -> dict[str, Any]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            total = await db.execute_fetchall("SELECT COUNT(*) AS c FROM memories")
            synced = await db.execute_fetchall(
                "SELECT COUNT(*) AS c FROM memories WHERE sync_status = 'synced'"
            )
            pending = await db.execute_fetchall(
                "SELECT COUNT(*) AS c FROM memories WHERE sync_status = 'pending'"
            )
            failed = await db.execute_fetchall(
                "SELECT COUNT(*) AS c FROM memories WHERE sync_status = 'failed'"
            )
        return {
            "total": total[0]["c"],
            "synced": synced[0]["c"],
            "pending": pending[0]["c"],
            "failed": failed[0]["c"],
        }

    async def log_sync(
        self,
        namespace: tuple[str, ...],
        key: str,
        action: str,
        *,
        cid: str | None = None,
        duration_ms: float | None = None,
    ) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                INSERT INTO sync_log (namespace, key, action, cid, duration_ms, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    self._ns_key(namespace),
                    key,
                    action,
                    cid,
                    duration_ms,
                    _dt_iso(_utcnow()),
                ),
            )
            await db.commit()

    async def sync_log_entries(self, limit: int = 50) -> list[dict[str, Any]]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                "SELECT * FROM sync_log ORDER BY id DESC LIMIT ?",
                (limit,),
            )
        return [dict(r) for r in rows]

    async def save_manifest(
        self, manifest_cid: str, item_count: int, tx_hash: str | None = None
    ) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                """
                INSERT INTO manifests (manifest_cid, item_count, tx_hash, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (manifest_cid, item_count, tx_hash, _dt_iso(_utcnow())),
            )
            await db.commit()

    async def latest_manifest(self) -> dict[str, Any] | None:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            rows = await db.execute_fetchall(
                "SELECT * FROM manifests ORDER BY id DESC LIMIT 1"
            )
        if not rows:
            return None
        return dict(rows[0])

    async def clear_all(self) -> None:
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("DELETE FROM memories")
            await db.execute("DELETE FROM sync_log")
            await db.execute("DELETE FROM manifests")
            await db.commit()


def _match_filter(value: dict[str, Any], filter: dict[str, Any]) -> bool:
    for k, expected in filter.items():
        if k not in value:
            return False
        actual = value[k]
        if isinstance(expected, dict) and isinstance(actual, dict):
            for op, operand in expected.items():
                if op == "$eq" and actual != operand:
                    return False
                if op == "$ne" and actual == operand:
                    return False
        elif actual != expected:
            return False
    return True
