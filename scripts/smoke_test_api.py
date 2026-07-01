"""Smoke tests for MemFOC demo API — run against live server on :8787."""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8787"


def req(method: str, path: str, body: dict | None = None) -> tuple[int, dict | list]:
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(r, timeout=15) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()}


def check(name: str, ok: bool, detail: str = "") -> bool:
    status = "PASS" if ok else "FAIL"
    print(f"  [{status}] {name}" + (f" — {detail}" if detail else ""))
    return ok


def main() -> int:
    print("\n=== MemFOC API Smoke Tests ===\n")
    passed = 0
    total = 0

    # Health
    total += 1
    code, data = req("GET", "/api/health")
    if check("GET /api/health", code == 200 and data.get("status") == "ok", str(data)):
        passed += 1

    # Stats
    total += 1
    code, stats = req("GET", "/api/stats")
    ok = code == 200 and "total" in stats
    if check("GET /api/stats", ok, f"total={stats.get('total')}"):
        passed += 1

    # Put memory
    total += 1
    code, put = req(
        "POST",
        "/api/memories",
        {"namespace": ["smoke", "test"], "key": "run", "value": {"ok": True}},
    )
    if check("POST /api/memories", code == 200 and put.get("sync_status") in ("pending", "synced"), str(put)):
        passed += 1

    # List memories
    total += 1
    code, memories = req("GET", "/api/memories")
    ok = code == 200 and isinstance(memories, list) and len(memories) > 0
    if check("GET /api/memories", ok, f"count={len(memories) if isinstance(memories, list) else 0}"):
        passed += 1

    # Sync log
    total += 1
    code, log = req("GET", "/api/sync-log")
    if check("GET /api/sync-log", code == 200 and isinstance(log, list), f"entries={len(log) if isinstance(log, list) else 0}"):
        passed += 1

    # Agent run
    total += 1
    code, agent = req("POST", "/api/agent/run", {"message": "remember theme dark", "user_id": "smoke-user"})
    ok = code == 200 and "reply" in agent
    if check("POST /api/agent/run", ok, agent.get("reply", "")[:60]):
        passed += 1

    # Assistant chat
    total += 1
    code, chat = req("POST", "/api/assistant/chat", {"message": "What is the grant ask?", "section": "grant"})
    ok = code == 200 and "reply" in chat and chat.get("agent") == "memfoc-guide"
    if check("POST /api/assistant/chat", ok, f"agent={chat.get('agent')}"):
        passed += 1

    # Design review / grant optimizer
    total += 1
    code, review = req(
        "POST",
        "/api/design-review",
        {
            "section": "grant",
            "viewport_w": 1440,
            "viewport_h": 900,
            "api_online": True,
            "dom": {"has_budget_bar": True, "cta_count": 3},
            "polish_active": False,
        },
    )
    ok = code == 200 and review.get("agent") == "grant-optimizer" and "score" in review
    if check("POST /api/design-review", ok, f"score={review.get('score')}/100"):
        passed += 1

    # Full audit
    total += 1
    code, audit = req("POST", "/api/grant-optimizer/full-audit", {"api_online": True})
    ok = code == 200 and audit.get("mode") == "full_audit" and "judge_path" in audit
    if check("POST /api/grant-optimizer/full-audit", ok, f"readiness={audit.get('overall_readiness')}%"):
        passed += 1

    # Benchmark
    total += 1
    code, bench = req("POST", "/api/benchmark")
    ok = code == 200 and "1kb" in bench
    if check("POST /api/benchmark", ok, f"1kb write={bench.get('1kb', {}).get('local_write_ms')}ms"):
        passed += 1

    # Manifest flush
    total += 1
    code, manifest = req("POST", "/api/manifest/flush")
    ok = code == 200
    if check("POST /api/manifest/flush", ok, str(manifest)[:80]):
        passed += 1

    # Stats after flush
    total += 1
    code, stats2 = req("GET", "/api/stats")
    ok = code == 200 and stats2.get("latest_manifest") is not None
    if check("GET /api/stats (post-flush manifest)", ok, str(stats2.get("latest_manifest", {}))[:60]):
        passed += 1

    print(f"\n=== Results: {passed}/{total} passed ===\n")
    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
