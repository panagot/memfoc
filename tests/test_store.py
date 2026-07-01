import asyncio

import pytest
from langgraph.store.base import GetOp, PutOp

from memfoc.store import FilecoinStore


@pytest.fixture
async def store(tmp_path):
    s = FilecoinStore(
        db_path=str(tmp_path / "index.db"),
        storage_dir=str(tmp_path / "blobs"),
    )
    await s.setup()
    yield s
    await s.aclose()


@pytest.mark.asyncio
async def test_put_and_get(store):
    await store.abatch([PutOp(("users", "1"), "theme", {"value": "dark"})])
    results = await store.abatch([GetOp(("users", "1"), "theme")])
    assert results[0] is not None
    assert results[0].value["value"] == "dark"


@pytest.mark.asyncio
async def test_async_foc_sync(store):
    await store.abatch([PutOp(("demo",), "a", {"x": 1})])
    await asyncio.sleep(0.5)
    row = await store.index.get(("demo",), "a")
    assert row is not None
    assert row.sync_status == "synced"
    assert row.cid is not None
