# FIL Builder / Open Grant — Application

**Submitted:** [filecoin-project/devgrants#2138](https://github.com/filecoin-project/devgrants/issues/2138)  
Program: [FIL Builder Next Step Grants](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Builder%20Next%20Step%20Grants.md)

---

## Project title

**MemFOC** — LangGraph `BaseStore` backed by Filecoin Onchain Cloud

---

## Summary

MemFOC is a Python library that implements LangGraph's `BaseStore` interface with Filecoin Onchain Cloud (FOC) as the durable storage layer and periodic FVM manifest anchoring for independent verification.

**Positioning:** PostgresStore semantics, with content-addressed durability and on-chain verification on Filecoin.

A working end-to-end prototype is shipped: `FilecoinStore`, async sync worker, demo API, interactive dashboard, LangGraph agent graph, and 22 passing pytest tests with CI. Grant funding completes **production Filecoin integration** (Synapse on Calibration/mainnet, FVM contract, PyPI release) — not a greenfield build.

**Verification:** Memory is content-addressed with PDP proofs on FOC and periodically anchored on-chain (FVM) for independent audit. See [VERIFICATION.md](./VERIFICATION.md).

**Live demo:** https://memfoc-one.vercel.app  
**Repository:** https://github.com/panagot/memfoc

---

## Problem

Agent frameworks like LangGraph expect memory through a compile-time store interface (`graph.compile(store=...)`). Today, teams choose between:

1. **Centralized backends** (PostgresStore, Redis) — fast but not portable or independently verifiable.
2. **Tool-based integrations** (Engram, Mem0) — require explicit API/tool calls inside agent nodes, not native `BaseStore` drop-in.
3. **Raw file storage** (FOC MCP servers) — no namespace semantics, search, or agent memory recovery.

[Filecoin RFS-1](https://filecoin.cloud/agents/rfs-1) identifies decentralized agent memory as a priority gap. No production-ready `BaseStore → Filecoin` adapter exists.

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

```python
graph = builder.compile(store=FilecoinStore())
```

---

## What exists today (prototype)

| Component | Status |
|-----------|--------|
| `FilecoinStore` — put, get, search, list namespaces, delete | Complete |
| SQLite index with sync status and CID tracking | Complete |
| Local FOC backend — content-addressed local blobs | Complete |
| Async `SyncWorker` with retry and WebSocket events | Complete |
| `flush_manifest()` and `rebuild_index()` recovery path | Complete (local dev anchor tx) |
| Demo API (FastAPI) + interactive dashboard | Complete |
| Automated tests (22 pytest) | Passing |
| GitHub Actions CI | pytest + frontend build |

Demo video: *(M2 deliverable — script: [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md))*

---

## What grant funding delivers

**Total ask:** $5,000  
**Duration:** 30 days from contract signing

| Milestone | Timeline | Budget | Outcome |
|-----------|----------|--------|---------|
| **M1** Synapse + Calibration FOC | Days 1–14 | $2,500 | Real FOC on Calibration; USDFC docs; expanded tests |
| **M2** FVM + mainnet + PyPI | Days 15–30 | $2,500 | `MemoryManifest.sol`; mainnet; PyPI; demo video |

---

## Milestone details

### M1 — Synapse + Calibration FOC ($2,500 · Days 1–14)

**Goal:** Replace local dev uploads with real Filecoin Onchain Cloud on Calibration testnet.

Deliverables:
- `SynapseBackend` via pynapse / synapse-filecoin-sdk
- Environment-based backend selection (local dev fallback preserved)
- Verifiable CIDs on Filecoin Calibration testnet
- USDFC payment flow documentation
- Dashboard observability for real upload status
- Expanded pytest coverage for sync/retry paths

Acceptance criteria:
- Writes produce verifiable Calibration CIDs
- Async worker retries and marks sync status correctly
- Local development works without testnet credentials

### M2 — FVM manifest + mainnet release ($2,500 · Days 15–30)

**Goal:** On-chain anchoring, mainnet deployment, and open-source release.

Deliverables:
- `MemoryManifest.sol` deployed to Calibration and mainnet
- `flush_manifest()` submits real FVM transactions
- `rebuild_index()` verified after simulated index loss
- PyPI publish: `pip install memfoc`
- Polished `examples/minimal_langgraph.py`
- 5-minute demo video for grant reporting
- Third-party verification guide ([VERIFICATION.md](./VERIFICATION.md))

Acceptance criteria:
- On-chain manifest event verifiable on explorer
- PyPI install + quick start under 30 minutes
- Demo video published (write → sync → manifest → rebuild)

---

## Budget breakdown

| Milestone | Amount | Share |
|-----------|--------|-------|
| M1 Synapse + Calibration FOC | $2,500 | 50% |
| M2 FVM + mainnet + PyPI | $2,500 | 50% |
| **Total** | **$5,000** | 100% |

Budget covers engineering time, testnet/mainnet transaction costs, and documentation.

---

## Outcomes at grant completion

1. Real FOC uploads on **Calibration and mainnet** via Synapse/pynapse with verifiable CIDs
2. `MemoryManifest.sol` deployed; `flush_manifest()` emits on-chain `SnapshotCommitted`
3. `rebuild_index()` restores SQLite from manifest + FOC blobs
4. `pip install memfoc` on PyPI with standalone LangGraph example
5. Demo video published

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

- `MemoryManifest.sol` on Calibration and mainnet
- Apache 2.0 licensed library on PyPI
- Full source, tests, and documentation in public GitHub repository

---

## Differentiation

See [DIFFERENTIATION.md](./DIFFERENTIATION.md).

| vs | MemFOC advantage |
|----|------------------|
| **PostgresStore** | Decentralized durability, CID proofs, manifest verification |
| **Engram SDK** | Native `BaseStore` drop-in |
| **Mem0** | Self-hosted; data on Filecoin |
| **foc-storage-mcp** | Agent memory semantics (namespaces, search, sync, recovery) |

---

## Team

**Panagiotis Pollis** — sole developer

- **GitHub:** [panagot](https://github.com/panagot)
- **LinkedIn:** [panagiotis-pollis-33509831](https://www.linkedin.com/in/panagiotis-pollis-33509831/)
- **X:** [@PANAGOT](https://x.com/PANAGOT)

Independent web3 builder since 2014 (Bitcoin). Full-stack developer. Previously founded Bitfortip.com (2015–2021).

**Recent shipped products:**

- **[Tracefunds](https://tracefunds.app)** — On-chain fund-flow intelligence for post-incident crypto tracing (multi-chain, public data only).
- **[Address Poisoning Detector](https://addresspoisoningdetector.com)** — Preventive monitoring for address-poisoning on Arbitrum One & Nova (scheduled scans, alerts, API).

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| pynapse SDK API changes | Local dev backend preserved; Synapse behind `StorageBackend` protocol |
| FVM gas costs for manifest flush | Periodic batching, not per-write anchoring |
| LangGraph BaseStore API evolution | Minimal surface area; compliance tests in CI |
| Testnet instability | Local dev fallback; retry logic in SyncWorker |
| 30-day timeline | Prototype complete; grant funds integration only |

---

## Maintenance and upgrade plans

Apache 2.0 open source. Post-grant: LangGraph community outreach, Filecoin Slack (#grants-help), tutorial content. `StorageBackend` protocol isolates Synapse API changes.

See also [ADOPTION.md](./ADOPTION.md), [COST_MODEL.md](./COST_MODEL.md).

---

## Success metrics

### At grant completion (M2)

1. `pip install memfoc` works from PyPI
2. LangGraph agent stores memory via `FilecoinStore()` on mainnet FOC
3. Manifest flush produces verifiable on-chain snapshot on FVM
4. `rebuild_index()` recovers full memory state from manifest + CIDs
5. New developer can integrate in under 30 minutes

---

## Links

| Resource | URL |
|----------|-----|
| Grant application | https://github.com/filecoin-project/devgrants/issues/2138 |
| Source code | https://github.com/panagot/memfoc |
| Live demo | https://memfoc-one.vercel.app |
| Demo video | *(M2 deliverable)* |
| Verification | [VERIFICATION.md](./VERIFICATION.md) |
| Differentiation | [DIFFERENTIATION.md](./DIFFERENTIATION.md) |
| Demo script | [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md) |

---

## Submission checklist

- [x] Public GitHub repository published
- [x] LICENSE (Apache 2.0) in repository root
- [x] README updated with architecture and quick start
- [x] Live demo deployed (Vercel)
- [x] Grant issue submitted ([#2138](https://github.com/filecoin-project/devgrants/issues/2138))
- [x] Team section filled in
- [x] GitHub Actions CI passing
- [ ] Demo video recorded (M2 deliverable)
