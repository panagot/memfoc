# MemFOC — Cost model (estimate)

Rough economics for grant reviewers. **Final numbers depend on FOC pricing at M2 mainnet launch.** Values below are illustrative for a typical agent workload.

---

## Assumptions

| Parameter | Example value |
|-----------|---------------|
| Average memory item size | 2 KB JSON |
| Items per active agent | 100,000 |
| Total durable storage | ~200 MB |
| Manifest flush frequency | 1× per day |
| Network | Filecoin mainnet FOC (post-grant) |

---

## Storage (FOC / USDFC)

Agent memory is stored as content-addressed blobs via Synapse. Pricing follows Filecoin Onchain Cloud storage rates (USDFC-denominated).

| Component | Estimate | Notes |
|-----------|----------|-------|
| Blob storage (200 MB) | Low single-digit USDFC / month | Dominated by FOC PDP storage fees |
| Per-write upload | Async, batched | Not charged per agent loop iteration to user |
| Manifest JSON | &lt; 1 MB per snapshot | Negligible vs blob volume |

**Key point:** MemFOC does not anchor every `put()` on FVM. Hot-path writes are local; FOC sync is background; FVM gas applies only on periodic manifest flush.

---

## On-chain (FVM)

| Action | Frequency | Estimate |
|--------|-----------|----------|
| `flush_manifest()` tx | Daily (configurable) | One FVM tx per snapshot, not per memory write |
| Contract deploy | Once (M3) | Calibration + mainnet deployment (grant budget) |

For an agent doing **1,000 puts/day**, MemFOC avoids **1,000 daily FVM transactions** compared to a per-write anchoring design.

---

## Comparison vs PostgresStore

| | PostgresStore | MemFOC |
|---|---------------|--------|
| **Hosting** | Managed Postgres ($20–200+/mo) | FOC storage (USDFC) |
| **Verification** | Trust operator | Independent CID + manifest audit |
| **Portability** | Migration project | Rebuild index from manifest |

MemFOC targets teams that already pay for durable infrastructure and want decentralized proofs — not necessarily the cheapest raw storage.

---

## USDFC payment flow (M2 deliverable)

Grant milestone M2 documents:

1. Developer funds Synapse service with USDFC
2. Uploads produce CIDs with PDP proofs
3. Local dev continues without USDFC via prototype backend fallback

See [Filecoin Onchain Cloud](https://filecoin.cloud/) for current pricing and payment docs.

---

## Disclaimer

These are **order-of-magnitude estimates** for grant planning. M2 will publish measured costs from Calibration testnet benchmarks.
