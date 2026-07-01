# FIL Builder Next Step Grant — Application

Use this document as the body of a GitHub issue when applying to the [FIL Builder Next Step Grants](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Builder%20Next%20Step%20Grants.md) program.

---

## Project title

**MemFOC** — LangGraph `BaseStore` backed by Filecoin Onchain Cloud

---

## Summary

MemFOC is a Python library that implements LangGraph's `BaseStore` interface with Filecoin Onchain Cloud (FOC) as the durable storage layer and periodic FVM manifest anchoring for independent verification.

**Positioning:** PostgresStore semantics, with content-addressed durability and on-chain verification on Filecoin.

A working localhost prototype is complete: core store, async sync worker, demo API, interactive dashboard, and automated tests. Grant funding ships testnet FOC integration, the FVM manifest contract, mainnet deployment, and PyPI release — not a greenfield build.

---

## Problem

Agent frameworks like LangGraph expect memory through a compile-time store interface (`graph.compile(store=...)`). Today, teams choose between:

1. **Centralized backends** (PostgresStore, Redis) — fast but not portable or independently verifiable.
2. **Tool-based integrations** (Engram, Mem0) — require explicit API/tool calls inside agent nodes, not native `BaseStore` drop-in.
3. **Raw file storage** (FOC MCP servers) — no namespace semantics, search, or agent memory recovery.

Filecoin RFS-1 identifies decentralized agent memory as a priority gap. No production-ready `BaseStore → Filecoin` adapter exists.

---

## Solution

MemFOC provides **immediate local consistency** (SQLite index, sub-20ms reads/writes) and **eventual decentralized durability** (async FOC upload with content-addressed CIDs), with **periodic on-chain manifest anchoring** (FVM) instead of per-write gas.

```text
LangGraph runtime.store.put / get / search
        │
        ▼
FilecoinStore (BaseStore)
        │
        ▼
SQLite index ──async──▶ FOC blobs (Synapse / pynapse)
        │
        ▼ periodic flush()
MemoryManifest.sol (FVM) ──▶ SnapshotCommitted(manifestCID)
```

Developers integrate with one line:

```python
graph = builder.compile(store=FilecoinStore())
```

---

## What exists today (prototype)

| Component | Status |
|-----------|--------|
| `FilecoinStore` — put, get, search, list namespaces, delete | Complete |
| SQLite index with sync status and CID tracking | Complete |
| `MockFOCBackend` — content-addressed local blobs | Complete |
| Async `SyncWorker` with retry and WebSocket events | Complete |
| `flush_manifest()` and `rebuild_index()` recovery path | Complete (simulated FVM tx) |
| Demo API (FastAPI) + interactive dashboard | Complete |
| Automated tests (17 pytest + 12 smoke tests) | Passing |

Repository: https://github.com/panagot/memfoc  
Live demo: https://memfoc-one.vercel.app  
Demo video: *(add link when recorded)*

---

## What grant funding delivers

| Milestone | Timeline | Budget | Outcome |
|-----------|----------|--------|---------|
| **M1** Core store + tests | Weeks 1–3 | $2,000 | CI, expanded BaseStore compliance tests, Calibration-ready packaging |
| **M2** Synapse backend | Weeks 4–6 | $2,500 | Real FOC uploads on Calibration via pynapse; USDFC payment docs |
| **M3** FVM manifest contract | Weeks 7–8 | $1,500 | `MemoryManifest.sol`; real FVM txs; third-party verification guide |
| **M4** Mainnet + release | Weeks 9–10 | $1,000 | Mainnet deploy; `pip install memfoc` on PyPI; LangGraph example; demo video |

**Total ask:** $7,000  
**Duration:** 10 weeks (July – October 2026)

---

## Milestone details

### M1 — Core store + tests ($2,000)

**Goal:** Harden the prototype into a grant-quality open-source foundation.

Deliverables:
- Expanded pytest suite (delete, search, namespace listing, manifest flush, index rebuild)
- GitHub Actions CI (pytest + frontend build)
- Calibration-ready package structure and environment configuration
- Documentation: README, architecture guide, differentiation doc

Acceptance criteria:
- All tests pass in CI on push
- `FilecoinStore.abatch` passes LangGraph BaseStore compliance scenarios
- README documents mock vs production backends clearly

### M2 — Synapse + production worker ($2,500)

**Goal:** Replace mock uploads with real Filecoin Onchain Cloud on Calibration testnet.

Deliverables:
- `SynapseBackend` implementation using pynapse / synapse-filecoin-sdk
- Environment-based backend selection (`MockFOCBackend` fallback for local dev)
- USDFC payment flow documentation
- Dashboard observability for real CIDs and upload status

Acceptance criteria:
- Writes produce verifiable CIDs on Calibration testnet
- Async worker retries and marks sync status correctly
- Local development still works without testnet credentials (mock fallback)

### M3 — FVM manifest contract ($1,500)

**Goal:** On-chain manifest anchoring and disaster recovery.

Deliverables:
- `MemoryManifest.sol` deployed to Filecoin Calibration
- `flush_manifest()` submits real FVM transactions
- `rebuild_index()` restores SQLite from anchored manifest + FOC blobs
- Third-party verification guide (audit workflow without trusting the operator)

Acceptance criteria:
- Manifest flush emits on-chain `SnapshotCommitted` event
- Index rebuild succeeds from manifest alone after simulated data loss
- Verification guide validated by independent walkthrough

### M4 — Mainnet + release ($1,000)

**Goal:** Production-ready open-source release.

Deliverables:
- Mainnet deployment (Synapse + FVM)
- PyPI publish: `pip install memfoc`
- Standalone LangGraph example in `examples/`
- 5-minute demo walkthrough video for grant reporting

Acceptance criteria:
- Package installable from PyPI with documented quick start
- Example runs without demo API or dashboard
- Video covers write → sync → manifest → rebuild flow

---

## Budget breakdown

| Milestone | Amount | Share |
|-----------|--------|-------|
| M1 Core store + tests | $2,000 | 29% |
| M2 Synapse backend | $2,500 | 36% |
| M3 FVM contract | $1,500 | 21% |
| M4 Mainnet + release | $1,000 | 14% |
| **Total** | **$7,000** | 100% |

Budget covers engineering time for implementation, testnet/mainnet transaction costs, and documentation. No hardware or infrastructure hosting is required beyond standard cloud CI.

---

## Filecoin ecosystem alignment

### RFS-1: Decentralized agent memory

| Requirement | MemFOC response |
|-------------|-----------------|
| Decentralized memory (Mem0 alternative) | FOC content-addressed blobs; self-hosted library |
| Framework adapter | Native LangGraph `BaseStore` |
| Verifiable storage | PDP on FOC + FVM manifest anchoring |
| Developer UX | SQLite hot path, async sync, disaster recovery |

### FVM + open source

- `MemoryManifest.sol` deployed to Calibration and mainnet
- Apache 2.0 licensed library published to PyPI
- Full source, tests, and documentation in public GitHub repository

### FOC / Synapse

- Production uploads via pynapse SDK
- USDFC payment integration documented
- Content-addressed CIDs with PDP proofs

---

## Differentiation

See [docs/DIFFERENTIATION.md](./DIFFERENTIATION.md) for full analysis.

| vs | MemFOC advantage |
|----|------------------|
| **PostgresStore** | Decentralized durability, CID proofs, manifest verification, portable recovery |
| **Engram SDK** | Native `BaseStore` drop-in; no tool wiring inside agent nodes |
| **Mem0** | Self-hosted; data on Filecoin; no vendor lock-in |
| **foc-storage-mcp** | Agent memory semantics (namespaces, search, sync, recovery) |

---

## Team

*(Add team member names, GitHub handles, and relevant experience.)*

Suggested fields:
- Primary developer — LangGraph / Python / Filecoin integration
- Prior work — links to repos, demos, or contributions in Filecoin or agent tooling ecosystems

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| pynapse SDK API changes | Mock backend preserves local dev; Synapse isolated behind `StorageBackend` protocol |
| FVM gas costs for manifest flush | Periodic batching, not per-write anchoring |
| LangGraph BaseStore API evolution | Minimal surface area; abatch compliance tests in CI |
| Testnet instability | Mock fallback; retry logic in SyncWorker |

---

## Success metrics

At grant completion:

1. `pip install memfoc` works from PyPI
2. LangGraph agent stores and retrieves memory via `FilecoinStore()` on mainnet FOC
3. Manifest flush produces verifiable on-chain snapshot on FVM
4. `rebuild_index()` recovers full memory state from manifest + CIDs
5. Documentation enables a new developer to integrate in under 30 minutes

---

## Links

| Resource | URL |
|----------|-----|
| Source code | https://github.com/panagot/memfoc |
| Live demo | https://memfoc-one.vercel.app |
| Demo video | *(add when recorded)* |
| Differentiation | [docs/DIFFERENTIATION.md](./DIFFERENTIATION.md) |
| Grant program | [FIL Builder Next Step Grants](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Builder%20Next%20Step%20Grants.md) |

---

## Checklist before submitting

- [ ] Public GitHub repository published
- [ ] LICENSE (Apache 2.0) in repository root
- [ ] README updated with architecture and quick start
- [ ] Live demo deployed (Vercel + API host)
- [ ] Demo video recorded (3–5 minutes, judge tour path)
- [ ] Team section filled in above
- [ ] Links table updated with real URLs
