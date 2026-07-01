import asyncio

import pytest
from langgraph.store.base import GetOp, ListNamespacesOp, MatchCondition, PutOp, SearchOp

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


@pytest.mark.asyncio
async def test_delete(store):
    await store.abatch([PutOp(("users", "1"), "temp", {"x": 1})])
    deleted = await store.abatch([PutOp(("users", "1"), "temp", None)])
    assert deleted[0] is True
    results = await store.abatch([GetOp(("users", "1"), "temp")])
    assert results[0] is None


@pytest.mark.asyncio
async def test_prefix_search(store):
    await store.abatch(
        [
            PutOp(("users", "alice", "prefs"), "theme", {"value": "dark"}),
            PutOp(("users", "bob", "prefs"), "theme", {"value": "light"}),
        ]
    )
    results = await store.abatch(
        [SearchOp(("users", "alice"), limit=10)]
    )
    assert len(results[0]) == 1
    assert results[0][0].key == "theme"


@pytest.mark.asyncio
async def test_list_namespaces(store):
    await store.abatch(
        [
            PutOp(("agents", "planner"), "plan", {"step": 1}),
            PutOp(("agents", "executor"), "task", {"step": 2}),
        ]
    )
    ns_list = await store.abatch(
        [
            ListNamespacesOp(
                match_conditions=(MatchCondition(match_type="prefix", path=["agents"]),),
                limit=10,
            )
        ]
    )
    assert ("agents", "planner") in ns_list[0]
    assert ("agents", "executor") in ns_list[0]


@pytest.mark.asyncio
async def test_flush_manifest(store):
    await store.abatch([PutOp(("demo",), "a", {"x": 1})])
    await asyncio.sleep(0.5)
    payload = await store.flush_manifest()
    assert payload["item_count"] >= 1
    assert payload["manifest_cid"]
    assert payload["tx_hash"].startswith("0x")
    manifest = await store.index.latest_manifest()
    assert manifest is not None


@pytest.mark.asyncio
async def test_rebuild_index(store):
    await store.abatch([PutOp(("recover",), "key", {"value": "saved"})])
    await asyncio.sleep(0.5)
    await store.flush_manifest()

    import aiosqlite

    async with aiosqlite.connect(store.index.db_path) as db:
        await db.execute("DELETE FROM memories")
        await db.commit()

    row = await store.index.get(("recover",), "key")
    assert row is None

    count = await store.rebuild_index()
    assert count >= 1
    row = await store.index.get(("recover",), "key")
    assert row is not None
    assert row.value["value"] == "saved"
