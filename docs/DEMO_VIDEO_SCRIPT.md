# MemFOC — Demo video script (3–5 minutes)

Record this walkthrough for the grant application and embed the link on the demo site + `docs/GRANT.md`.

**Suggested tools:** Loom, OBS, or screen recording with voiceover.

---

## 0:00 — Hook (15 sec)

> MemFOC brings decentralized, verifiable memory to LangGraph agents — a drop-in replacement for PostgresStore, backed by Filecoin.

Show: Homepage hero + one line of code:

```python
graph = builder.compile(store=FilecoinStore())
```

---

## 0:15 — Problem (30 sec)

> LangGraph expects memory through compile-time store injection. Postgres is centralized. Engram and Mem0 use tools or hosted APIs — not native BaseStore. Filecoin RFS-1 asks for decentralized agent memory. MemFOC fills that gap.

Show: Integration section or README architecture diagram.

---

## 0:45 — Live demo: write + sync (60 sec)

1. Open **Live console**
2. Click **Seed demo data** (or show auto-seeded rows on Vercel)
3. Point out `sync_status`: pending → synced
4. Show CID column appearing

Say:

> Writes hit SQLite in under 20 milliseconds. FOC upload happens asynchronously — the agent never blocks.

---

## 1:45 — Agent playground (45 sec)

1. Open **Agent playground**
2. Run: `remember theme dark`
3. Run: `what is my theme?`
4. Show reply + memories in console

Say:

> This is a real LangGraph StateGraph compiled with FilecoinStore — not a fake UI.

---

## 2:30 — Manifest + recovery (45 sec)

1. Open **Manifest & recovery**
2. Click **Flush manifest**
3. Show manifest CID + simulated tx hash
4. Mention: production ships MemoryManifest.sol on FVM (M3)

Say:

> Memory is content-addressed with PDP proofs on FOC. Periodic manifest anchoring — not per-write gas — enables independent verification.

---

## 3:15 — Benchmarks (20 sec)

Run benchmark once. Show write/read bars under 20ms target.

---

## 3:35 — Grant ask (45 sec)

Open **Grant roadmap**:

> $7,000 over 10 weeks ships Synapse on testnet, FVM contract, and pip install memfoc. The architecture is proven today — grant funds production Filecoin integration.

Show **Today → Funded** section briefly.

---

## 4:20 — Close (15 sec)

> Repo and live demo links in description. MemFOC — PostgresStore semantics on verifiable Filecoin storage.

---

## Checklist before publishing

- [ ] 1080p, readable text
- [ ] Mic clear, no background noise
- [ ] Links in video description: GitHub, Vercel demo, GRANT.md
- [ ] Upload to YouTube (unlisted) or Loom
- [ ] Update README + `docs/GRANT.md` + demo site video button
