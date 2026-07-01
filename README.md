# MemFOC

**LangGraph `BaseStore` backed by Filecoin Onchain Cloud**

PostgresStore semantics — with content-addressed durability and on-chain verification on Filecoin.

**Repository:** [github.com/panagot/memfoc](https://github.com/panagot/memfoc)  
**Live demo:** [memfoc-one.vercel.app](https://memfoc-one.vercel.app)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](pyproject.toml)
[![LangGraph](https://img.shields.io/badge/LangGraph-BaseStore-green.svg)](https://langchain-ai.github.io/langgraph/)

---

## Overview

MemFOC is a Python library that plugs into LangGraph as a native memory backend. Agents read and write memory through the standard `BaseStore` interface — the same API used by PostgresStore and InMemoryStore — while payloads are durably stored as content-addressed blobs on Filecoin Onchain Cloud (FOC) and periodically anchored on the Filecoin Virtual Machine (FVM).

**Design principle:** immediate local consistency, eventual decentralized durability, periodic on-chain manifest anchoring (not per-write gas).

```python
from langgraph.graph import StateGraph
from memfoc.store import FilecoinStore

store = FilecoinStore()
graph = builder.compile(store=store)
```

One line at compile time. No tool wrappers. No manual API calls inside agent nodes.

---

## Why MemFOC

| Capability | Description |
|------------|-------------|
| **Drop-in BaseStore** | Replace `InMemoryStore` or `PostgresStore` with `FilecoinStore()` |
| **Sub-20ms hot path** | SQLite index serves reads and writes instantly; FOC sync is async |
| **Content-addressed CIDs** | Every memory blob is stored with a verifiable Filecoin content ID |
| **Disaster recovery** | `rebuild_index()` restores SQLite from the latest manifest and FOC blobs |
| **Auditable snapshots** | Periodic FVM manifest anchoring for independent third-party verification |

For competitive positioning against PostgresStore, Engram, Mem0, and FOC MCP tools, see [docs/DIFFERENTIATION.md](docs/DIFFERENTIATION.md).

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  LangGraph Runtime                                          │
│  runtime.store.put · get · search · list_namespaces         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  FilecoinStore (BaseStore)                                  │
│  abatch · async sync · manifest flush · index rebuild       │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────────┐  ┌──────────────────────────────┐
│  SQLite Index           │  │  Sync Worker (background)    │
│  <20ms reads/writes     │  │  retry · WebSocket events    │
│  sync_status · CIDs     │  └──────────────┬───────────────┘
└─────────────────────────┘                 │
                                              ▼
                              ┌───────────────────────────────┐
                              │  FOC Storage Layer            │
                              │  MockFOCBackend (prototype)   │
                              │  SynapseBackend (grant M2)    │
                              └──────────────┬────────────────┘
                                             │
                                             ▼ periodic flush()
                              ┌───────────────────────────────┐
                              │  FVM MemoryManifest           │
                              │  SnapshotCommitted(manifestCID)│
                              └───────────────────────────────┘
```

**Write path:** Agent calls `put` → SQLite row created (`sync_status: pending`) → returns immediately → background worker uploads to FOC → row marked `synced` with CID.

**Recovery path:** `flush_manifest()` commits all synced CIDs → `rebuild_index()` walks manifest → restores SQLite from FOC blobs.

---

## Prototype status

This repository contains a **working localhost prototype**. Grant funding ships production Filecoin integration.

| Component | Status | Notes |
|-----------|--------|-------|
| `FilecoinStore` (put, get, search, delete, list) | Done | LangGraph `BaseStore` compliant |
| SQLite index | Done | Sub-20ms hot path |
| `MockFOCBackend` | Done | Content-addressed blobs in `.memfoc/blobs/` |
| Async sync worker | Done | Retry, WebSocket events |
| Manifest flush + index rebuild | Done | Simulated FVM transaction hash |
| Demo API + dashboard | Done | FastAPI + React interactive site |
| Automated tests | Done | 17 pytest + 12 smoke tests |
| Synapse / pynapse (Calibration) | Grant M2 | Real FOC uploads |
| `MemoryManifest.sol` (FVM) | Grant M3 | On-chain anchoring |
| PyPI release + mainnet | Grant M4 | `pip install memfoc` |

Full grant application with milestones and budget: [docs/GRANT.md](docs/GRANT.md)

---

## Quick start

### Prerequisites

- Python 3.11+
- Node.js 18+ (for the demo dashboard)

### Install and run

**Windows (PowerShell):**

```powershell
git clone https://github.com/panagot/memfoc.git
cd memfoc

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[demo,dev]"

# Terminal 1 — API server
python -m demo.server.main

# Terminal 2 — Dashboard
cd demo\web
npm install
npm run dev
```

**macOS / Linux:**

```bash
git clone https://github.com/panagot/memfoc.git
cd memfoc

python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[demo,dev]"

# Terminal 1 — API server
python -m demo.server.main

# Terminal 2 — Dashboard
cd demo/web
npm install
npm run dev
```

**Or start both on Windows:**

```powershell
.\scripts\start.ps1
```

### URLs

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:5173 |
| API docs | http://127.0.0.1:8787/docs |
| Health check | http://127.0.0.1:8787/api/health |

---

## Library usage

```python
import asyncio
from langgraph.store.base import GetOp, PutOp
from memfoc.store import FilecoinStore

async def main():
    store = FilecoinStore(
        db_path=".memfoc/index.db",
        storage_dir=".memfoc/blobs",
    )
    await store.setup()

    await store.abatch([
        PutOp(("users", "alice"), "theme", {"value": "dark"}),
    ])

    results = await store.abatch([
        GetOp(("users", "alice"), "theme"),
    ])
    print(results[0].value)  # {"value": "dark"}

    await store.aclose()

asyncio.run(main())
```

Semantic search with embedding queries is deferred to v1.1. Prefix search and namespace filtering are supported in v1.

---

## Demo dashboard

The interactive demo site is designed for grant reviewers and integrators:

| Section | Purpose |
|---------|---------|
| Overview | Product summary and value proposition |
| Architecture | Layer diagram and data flow |
| Guided demo | Step-by-step walkthrough |
| Live console | Real-time memory table and WebSocket sync feed |
| Agent playground | Demo agent reading/writing via FilecoinStore |
| Benchmarks | Hot-path latency measurements |
| Manifest & recovery | Flush manifest and rebuild index |
| Grant roadmap | Milestones, budget, RFS-1 alignment |

Built-in assistants: **MemFOC Guide** (architecture Q&A) and **Grant Optimizer** (rubric scoring).

---

## Testing

Run the full verification suite:

```powershell
# Requires API server running on :8787 for smoke tests
.\scripts\run_all_tests.ps1
```

Or run pytest alone:

```powershell
python -m pytest tests/ -v -p no:langsmith
```

On Windows, the `-p no:langsmith` flag avoids a known pytest plugin conflict. Linux/macOS CI does not require it.

| Suite | Coverage |
|-------|----------|
| `tests/test_store.py` | Put/get, async FOC sync |
| `tests/test_assistants.py` | MemFOC Guide intent routing |
| `tests/test_api_integration.py` | Full API routes via TestClient |
| `scripts/smoke_test_api.py` | Live HTTP smoke tests (12 checks) |

---

## Project structure

```text
memfoc/
├── src/memfoc/           Core library
│   ├── store.py          FilecoinStore (BaseStore)
│   ├── index.py          SQLite memory index
│   ├── worker.py         Async sync + manifest flush
│   └── backend/          StorageBackend protocol + MockFOCBackend
├── demo/
│   ├── server/           FastAPI API + assistants
│   └── web/              React demo dashboard
├── tests/                Pytest suite (8+ store tests)
├── examples/             minimal_langgraph.py
├── scripts/              start.ps1, run_all_tests.ps1, smoke_test_api.py
├── docs/
│   ├── GRANT.md          FIL Builder grant application
│   └── DIFFERENTIATION.md  Competitive positioning
├── LICENSE               Apache 2.0
└── pyproject.toml
```

---

## Grant

MemFOC is applying to the **FIL Builder Next Step Grant** ($7,000, 10 weeks).

| Milestone | Budget | Deliverable |
|-----------|--------|-------------|
| M1 Core store + tests | $2,000 | CI, expanded tests, Calibration-ready packaging |
| M2 Synapse backend | $2,500 | Real FOC on Calibration testnet |
| M3 FVM contract | $1,500 | `MemoryManifest.sol`, on-chain anchoring |
| M4 Mainnet + release | $1,000 | PyPI, examples, demo video |

Application document: [docs/GRANT.md](docs/GRANT.md)

Program reference: [FIL Builder Next Step Grants](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Builder%20Next%20Step%20Grants.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/GRANT.md](docs/GRANT.md) | Full grant application with milestones, budget, and acceptance criteria |
| [docs/DIFFERENTIATION.md](docs/DIFFERENTIATION.md) | Comparison vs PostgresStore, Engram, Mem0, foc-storage-mcp |

---

## License

Apache License 2.0 — see [LICENSE](LICENSE).

---

## Contributing

Contributions are welcome. Please open an issue before large changes. Grant milestone work will be tracked against [docs/GRANT.md](docs/GRANT.md) acceptance criteria.
