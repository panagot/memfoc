# MemFOC — Competitive Positioning

This document explains how MemFOC compares to existing agent memory solutions and why the current prototype scope is intentional.

---

## Executive summary

MemFOC is a **LangGraph `BaseStore` implementation** backed by **Filecoin Onchain Cloud (FOC)**. It delivers PostgresStore-like ergonomics with decentralized durability and periodic on-chain manifest anchoring on the Filecoin Virtual Machine (FVM).

**One-line positioning:** PostgresStore semantics, with content-addressed durability and verifiable snapshots on Filecoin.

MemFOC is not a hosted memory API, not a LangChain tool wrapper, and not a general-purpose file upload layer. It is a native storage adapter for LangGraph agents that need durable, auditable memory without rewriting agent code.

Engram and Mem0 provide higher-level memory platforms. MemFOC solves a narrower infrastructure problem: plug-in persistence for LangGraph's official `BaseStore` interface.

---

## Product layer positioning

| Product | Layer |
|---------|-------|
| PostgresStore | Database backend |
| Mem0 | Memory intelligence layer |
| Engram | Decentralized memory platform |
| **MemFOC** | **LangGraph-native storage adapter** |

---

## Comparison matrix

| Solution | Native LangGraph `BaseStore` | Decentralized durability | Content-addressed (CID) | On-chain verification | Integration style |
|----------|:----------------------------:|:------------------------:|:-----------------------:|:---------------------:|-------------------|
| **MemFOC** | Yes | Yes | Yes | Yes (FVM manifest) | `graph.compile(store=FilecoinStore())` |
| **PostgresStore** | Yes | No | No | No | `graph.compile(store=PostgresStore(...))` |
| **Engram SDK** | No | Yes | Yes | Partial | LangChain tools (`store` / `retrieve`) |
| **Mem0** | No | No | No | No | Hosted REST API |
| **foc-storage-mcp** | No | Yes | Yes | No | MCP file upload tools |

---

## MemFOC vs PostgresStore

PostgresStore is the official LangGraph reference backend for production agent memory. It is mature, well documented, and fits most centralized deployments.

| Dimension | PostgresStore | MemFOC |
|-----------|---------------|--------|
| **Integration** | Identical `BaseStore` API | Identical `BaseStore` API |
| **Read/write latency** | Network-bound to Postgres | Sub-20ms SQLite hot path |
| **Durability model** | Single database instance | Local index + FOC blobs |
| **Portability** | Requires DB migration | Rebuild index from manifest + CIDs |
| **Auditability** | Trust the operator | Independent CID + manifest verification |
| **Operational cost** | Postgres hosting | FOC storage (USDFC) + periodic FVM gas |

**When PostgresStore is the right choice:** You operate a centralized stack, need semantic search today, and do not require decentralized proofs.

**When MemFOC is the right choice:** You want LangGraph-native integration, decentralized durability, content-addressed blobs, and periodic on-chain anchoring without per-write gas costs.

---

## MemFOC vs Engram SDK

Engram is a Filecoin-backed memory layer for LangChain agents. It addresses a similar problem space but with a different integration model.

| Dimension | Engram | MemFOC |
|-----------|--------|--------|
| **Framework fit** | LangChain tools inside nodes | LangGraph `BaseStore` at compile time |
| **Agent code changes** | Call store/retrieve tools explicitly | Use `runtime.store.put/get` — no tool wiring |
| **Language focus** | Multi-language SDK | Python-first (LangGraph ecosystem) |
| **Scope** | Broader memory product | Narrow adapter: BaseStore + FOC + FVM manifest |
| **Hot path** | Depends on integration pattern | SQLite index, async FOC sync |

**Key distinction:** Engram is a valuable decentralized memory platform using LangChain tools. MemFOC plugs into LangGraph's compile-time store slot — the same pattern teams already use with PostgresStore and InMemoryStore.

For teams already on LangGraph with `graph.compile(store=...)`, MemFOC is a drop-in replacement path. Engram requires restructuring nodes to call external tools.

---

## MemFOC vs Mem0

Mem0 is a hosted, centralized memory API popular for quick integration across frameworks.

| Dimension | Mem0 | MemFOC |
|-----------|------|--------|
| **Deployment** | SaaS API | Self-hosted library + FOC |
| **Data custody** | Mem0 infrastructure | Your blobs on Filecoin |
| **LangGraph integration** | Custom wrapper or API calls | Native `BaseStore` |
| **Verifiability** | Trust the provider | CID proofs + FVM manifest |
| **Vendor lock-in** | High | Low — rebuild from manifest |

Mem0 optimizes for speed of integration. MemFOC optimizes for durability, portability, and independent verification aligned with Filecoin RFS-1.

---

## MemFOC vs foc-storage-mcp

The Filecoin ecosystem includes MCP servers for uploading files to FOC. These solve storage transport, not agent memory semantics.

| Dimension | foc-storage-mcp | MemFOC |
|-----------|-----------------|--------|
| **Abstraction** | File upload/download | Namespace-keyed agent memory |
| **LangGraph awareness** | None | Full `BaseStore` compliance |
| **Search / namespaces** | Not applicable | Prefix search, namespace listing |
| **Sync model** | Manual per file | Automatic async worker per write |
| **Recovery** | Manual | `rebuild_index()` from manifest |

foc-storage-mcp is complementary infrastructure. MemFOC is an agent memory layer built on top of similar FOC primitives.

---

## Design decisions that differentiate MemFOC

### 1. Immediate local consistency, eventual decentralized durability

Agent loops cannot block on network uploads. MemFOC writes to SQLite first (<20ms), then syncs to FOC asynchronously. This matches production agent behavior: many writes per session, reads must be instant.

### 2. Periodic manifest anchoring, not per-write gas

Writing every memory key to FVM would be cost-prohibitive. MemFOC batches synced CIDs into manifest snapshots and anchors them periodically. Third parties verify state from the manifest root without replaying every individual write.

### 3. Native BaseStore, not a tool layer

LangGraph's store interface is designed for compile-time injection. MemFOC implements that interface directly so agents use the same `put`, `get`, and `search` patterns as PostgresStore — no additional tool definitions or prompt engineering.

### 4. Narrow v1 scope

Semantic search (embedding-based query) is explicitly deferred to v1.1 with `NotImplementedError`. v1 focuses on the core durability story: put, get, prefix search, namespace listing, sync, manifest, and recovery.

---

## Prototype vs production: why simulation is intentional today

The current repository ships a **working end-to-end prototype** of the MemFOC architecture:

| Component | Prototype (today) | Production (grant-funded) |
|-----------|-------------------|---------------------------|
| FOC uploads | Prototype backend — content-addressed blobs in `.memfoc/blobs/` | `SynapseBackend` via pynapse on Calibration/mainnet |
| FVM anchoring | Simulated transaction hash | `MemoryManifest.sol` on FVM |
| Distribution | `pip install -e .` from source | `pip install memfoc` on PyPI |
| Payments | Not applicable locally | USDFC for FOC storage |

The prototype backend is not a placeholder UI — it implements the same content-addressing, CID assignment, async worker, and manifest flow that production will use. Grant funding replaces the transport layer (prototype → Synapse) and the anchoring layer (simulated → real FVM contract), not the architecture.

**Disaster recovery invariant:** SQLite loss is recoverable from the latest anchored manifest + FOC blobs. See [docs/VERIFICATION.md](./VERIFICATION.md).

This de-risks the grant: reviewers can run and test the full write → sync → manifest → rebuild loop today without testnet credentials.

---

## Filecoin RFS-1 alignment

Filecoin Request for Startups #1 identifies decentralized agent memory as a priority gap. MemFOC maps directly:

| RFS-1 requirement | MemFOC response |
|-------------------|-----------------|
| Decentralized agent memory (Mem0 alternative) | Content-addressed FOC blobs; no hosted API |
| Drop-in adapter for agent frameworks | `FilecoinStore` implements LangGraph `BaseStore` |
| Verifiable storage proofs | PDP on FOC + manifest `root_hash` anchored on FVM |
| Production-grade developer UX | SQLite hot path, async sync, `rebuild_index()` recovery |

---

## Summary

MemFOC occupies a specific niche: **the LangGraph-native path to Filecoin-backed agent memory**. It does not compete with PostgresStore on feature breadth, with Mem0 on integration speed, or with MCP file tools on generic storage. It competes on being the first `BaseStore` adapter that makes Filecoin durability a one-line compile-time choice for LangGraph agents.

For grant reviewers: the prototype proves the architecture. Funding ships the production backends (Synapse, FVM, PyPI) on top of code that already runs end-to-end locally.
