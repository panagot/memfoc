# MemFOC

**LangGraph `BaseStore` backed by Filecoin Onchain Cloud**

MemFOC brings decentralized long-term memory to LangGraph agents — a drop-in replacement for PostgresStore with verifiable storage and on-chain auditability.

**Repository:** [github.com/panagot/memfoc](https://github.com/panagot/memfoc)  
**Live demo:** [memfoc-one.vercel.app](https://memfoc-one.vercel.app)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](pyproject.toml)
[![LangGraph](https://img.shields.io/badge/LangGraph-BaseStore-green.svg)](https://langchain-ai.github.io/langgraph/)
[![CI](https://github.com/panagot/memfoc/actions/workflows/ci.yml/badge.svg)](https://github.com/panagot/memfoc/actions/workflows/ci.yml)

---

## Overview

MemFOC is a Python library that plugs into LangGraph as a native memory backend. Agents read and write memory through the standard `BaseStore` interface — the same API used by PostgresStore and InMemoryStore — while payloads are durably stored as content-addressed blobs on [Filecoin Onchain Cloud](https://filecoin.cloud/) (FOC) and periodically anchored on the Filecoin Virtual Machine (FVM).

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
                              │  Local dev backend (demo)     │
                              │  SynapseBackend (planned)     │
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

## Build status

| Component | Status | Notes |
|-----------|--------|-------|
| `FilecoinStore` (put, get, search, delete, list) | Shipped | LangGraph `BaseStore` compliant |
| SQLite index | Shipped | Sub-20ms hot path |
| Local FOC backend | Shipped | Content-addressed blobs in `.memfoc/blobs/` for dev/demo |
| Async sync worker | Shipped | Retry, WebSocket events |
| Manifest flush + index rebuild | Shipped | Local dev anchor tx; FVM contract planned |
| Demo API + dashboard + LangGraph agent | Shipped | FastAPI + React + real StateGraph |
| Automated tests + CI | Shipped | pytest + GitHub Actions |
| Synapse / pynapse (testnet) | Planned | Real FOC uploads |
| `MemoryManifest.sol` (FVM) | Planned | On-chain anchoring |
| PyPI release + mainnet | Planned | `pip install memfoc` |

Grant milestones and budget (for reviewers): [docs/GRANT.md](docs/GRANT.md)

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

The [live demo](https://memfoc-one.vercel.app) is a product site — architecture, walkthrough, and live API console. Grant application content lives in [docs/GRANT.md](docs/GRANT.md), not on the public UI.

| Section | Purpose |
|---------|---------|
| Overview | Product summary, architecture diagram, live stats |
| Architecture | Layer diagram and integration code |
| Guided demo | Step-by-step walkthrough |
| Live console | Real-time memory table and WebSocket sync feed |
| Roadmap | Shipped vs planned releases |
| Integration | PostgresStore vs FilecoinStore comparison |
| Use cases | Personalization, audit, multi-agent, portability |
| How it works | Write → sync → anchor → recover |
| Agent playground | LangGraph graph with FilecoinStore |
| Benchmarks | Hot-path latency measurements |
| Manifest & recovery | Flush manifest and rebuild index |

Built-in **MemFOC Guide** assistant answers architecture and integration questions (grant/budget questions redirect to `docs/GRANT.md`).

**Stack:** React + Vite + Tailwind, left navigation shell, [Radix UI](https://www.radix-ui.com/) scroll primitives, Filecoin blue (`#0090FF`) accent.

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
│   └── backend/          StorageBackend protocol + local dev backend
├── demo/
│   ├── server/           FastAPI API + assistants
│   └── web/              React demo dashboard
├── tests/                Pytest suite
├── examples/             minimal_langgraph.py
├── scripts/              start.ps1, run_all_tests.ps1, smoke_test_api.py
├── docs/
│   ├── GRANT.md          Grant application (not on live demo UI)
│   └── DIFFERENTIATION.md  Competitive positioning
├── LICENSE               Apache 2.0
└── pyproject.toml
```

---

## Grant

MemFOC is applying to the **FIL Builder Next Step Grant** ($7,000, 10 weeks). Full application, milestones, and budget: [docs/GRANT.md](docs/GRANT.md)

Program reference: [FIL Builder Next Step Grants](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Builder%20Next%20Step%20Grants.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/GRANT.md](docs/GRANT.md) | Full grant application with milestones, budget, and acceptance criteria |
| [docs/DIFFERENTIATION.md](docs/DIFFERENTIATION.md) | Comparison vs PostgresStore, Engram, Mem0, foc-storage-mcp |
| [docs/VERIFICATION.md](docs/VERIFICATION.md) | Disaster recovery invariant and third-party audit workflow |
| [docs/COST_MODEL.md](docs/COST_MODEL.md) | Illustrative USDFC storage and FVM gas estimates |
| [docs/ADOPTION.md](docs/ADOPTION.md) | Post-launch adoption plan and 90-day metrics |
| [docs/DEMO_VIDEO_SCRIPT.md](docs/DEMO_VIDEO_SCRIPT.md) | Demo walkthrough script |

---

## License

Apache License 2.0 — see [LICENSE](LICENSE).

---

## Contributing

Contributions are welcome. Please open an issue before large changes.
