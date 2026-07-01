# MemFOC — Verification and disaster recovery

How memory state is proven and recovered — today (prototype) and after grant milestones.

---

## Core invariant

> **SQLite loss is recoverable from the latest manifest + FOC blobs.**

The local index is a performance cache. Durable truth lives in content-addressed FOC storage; periodic FVM manifests anchor the snapshot for independent audit.

---

## Data flow

```text
put/get  →  SQLite index (immediate)
         →  async worker  →  FOC blob (CID)
         →  periodic flush  →  manifest JSON (CID)  →  FVM anchor (M3)
```

---

## Prototype today

| Step | Status |
|------|--------|
| Content-addressed blob per memory | Prototype backend (same CID semantics as production) |
| Manifest JSON with all synced CIDs | Working |
| On-chain tx | Simulated hash (grant M3 ships real contract) |
| `rebuild_index()` | Working — restores SQLite from manifest + blobs |

---

## Third-party verification (post-M3)

An auditor without access to your server can:

1. Read the latest `manifestCID` from `MemoryManifest.sol` on FVM
2. Download manifest JSON from FOC by CID
3. Recompute `root_hash` from listed memory CIDs
4. Spot-check any memory blob by fetching its CID from FOC
5. Confirm PDP proofs via Filecoin Onchain Cloud

No trust in the operator's API is required for verification.

---

## Disaster recovery procedure

**Scenario:** SQLite database deleted or corrupted.

```python
store = FilecoinStore(db_path="fresh.db", backend=SynapseBackend(...))
await store.setup()
count = await store.rebuild_index()
# SQLite repopulated from latest anchored manifest
```

Requirements:

- Latest manifest row (or manifest CID from FVM after M3)
- FOC blobs still available at listed CIDs

---

## Why periodic anchoring

Per-write FVM registration would be cost-prohibitive for agent workloads (hundreds of puts per session). MemFOC batches synced CIDs into manifest snapshots — typically daily or on-demand — balancing auditability and gas cost.
