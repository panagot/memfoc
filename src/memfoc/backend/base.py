from __future__ import annotations

import hashlib
import json
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(slots=True)
class UploadResult:
    cid: str
    size_bytes: int
    duration_ms: float


class StorageBackend(ABC):
    """Pluggable FOC storage layer (mock for localhost, Synapse for production)."""

    @abstractmethod
    async def upload(self, payload: dict[str, Any]) -> UploadResult:
        raise NotImplementedError

    @abstractmethod
    async def download(self, cid: str) -> dict[str, Any]:
        raise NotImplementedError


class MockFOCBackend(StorageBackend):
    """
    Localhost Filecoin Onchain Cloud simulator.
    Writes content-addressed blobs to disk with realistic latency.
    """

    def __init__(self, storage_dir: str | Path, *, latency_ms: float = 120.0) -> None:
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self.latency_ms = latency_ms

    @staticmethod
    def _cid_for_payload(payload: dict[str, Any]) -> str:
        raw = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
        digest = hashlib.sha256(raw).hexdigest()
        return f"bafkreih{digest[:52]}"

    async def upload(self, payload: dict[str, Any]) -> UploadResult:
        import asyncio

        start = time.perf_counter()
        await asyncio.sleep(self.latency_ms / 1000.0)
        cid = self._cid_for_payload(payload)
        path = self.storage_dir / f"{cid}.json"
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        size = path.stat().st_size
        duration_ms = (time.perf_counter() - start) * 1000
        return UploadResult(cid=cid, size_bytes=size, duration_ms=duration_ms)

    async def download(self, cid: str) -> dict[str, Any]:
        path = self.storage_dir / f"{cid}.json"
        if not path.exists():
            raise FileNotFoundError(f"Blob not found: {cid}")
        return json.loads(path.read_text(encoding="utf-8"))
