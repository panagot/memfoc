"""Integration tests for demo API routes (in-process, no live server required)."""

from fastapi.testclient import TestClient

from demo.server.main import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_stats():
    r = client.get("/api/stats")
    assert r.status_code == 200
    assert "total" in r.json()


def test_put_and_list_memories():
    r = client.post(
        "/api/memories",
        json={"namespace": ["test", "api"], "key": "item", "value": {"x": 1}},
    )
    assert r.status_code == 200
    assert r.json()["sync_status"] in ("pending", "synced")

    r2 = client.get("/api/memories")
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)


def test_agent_run():
    r = client.post("/api/agent/run", json={"message": "remember theme light", "user_id": "test"})
    assert r.status_code == 200
    assert "reply" in r.json()


def test_assistant_chat():
    r = client.post(
        "/api/assistant/chat",
        json={"message": "What is the grant ask?", "section": "roadmap"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["agent"] == "memfoc-guide"
    assert "GRANT.md" in data["reply"]


def test_design_review_grant_optimizer():
    r = client.post(
        "/api/design-review",
        json={
            "section": "grant",
            "viewport_w": 1440,
            "viewport_h": 900,
            "api_online": True,
            "dom": {"has_budget_bar": True, "cta_count": 3},
            "polish_active": False,
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["agent"] == "grant-optimizer"
    assert 0 < data["score"] <= 100
    assert len(data["rubric"]) == 6


def test_grant_full_audit():
    r = client.post("/api/grant-optimizer/full-audit", json={"api_online": True})
    assert r.status_code == 200
    data = r.json()
    assert data["mode"] == "full_audit"
    assert "overview" in data["judge_path"]


def test_benchmark():
    r = client.post("/api/benchmark")
    assert r.status_code == 200
    assert "1kb" in r.json()


def test_manifest_flush():
    r = client.post("/api/manifest/flush")
    assert r.status_code == 200

    stats = client.get("/api/stats").json()
    assert stats.get("latest_manifest") is not None


def test_sync_log():
    r = client.get("/api/sync-log")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
