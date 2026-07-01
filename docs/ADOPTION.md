# MemFOC — Adoption plan (post-grant)

How we drive usage after M4 delivery. Included in the grant application to show the project will be used, not just built.

---

## Phase 1 — Launch (weeks 9–10, M4)

- Publish `memfoc` on PyPI
- Tag GitHub release `v0.1.0` with changelog
- Publish demo video (3–5 min judge walkthrough)
- Submit integration guide to LangGraph community channels

---

## Phase 2 — Developer discovery (month 1–2)

| Channel | Action |
|---------|--------|
| **GitHub** | README quick start, `examples/minimal_langgraph.py`, CI badge |
| **LangGraph Discord / forum** | "BaseStore on Filecoin" integration post |
| **Filecoin Slack** | Share in #grants-help and AI/agent channels |
| **Blog / tutorial** | "Replace PostgresStore with FilecoinStore in 5 minutes" |
| **Live demo** | Keep Vercel site updated with testnet CIDs after M2 |

---

## Phase 3 — Ecosystem (month 2–3)

- Open GitHub issues for Synapse edge cases and community backends
- Respond to Filecoin RFS-1 agent memory feedback
- Track PyPI download counts and GitHub stars as public metrics
- Optional: LangGraph store registry listing (if available)

---

## Success metrics (90 days post-launch)

| Metric | Target |
|--------|--------|
| PyPI installs | 500+ |
| GitHub stars | 50+ |
| External tutorials / forks | 3+ |
| Testnet agents using FilecoinStore | 5+ documented |

These are aspirational targets for grant reporting — not guarantees.

---

## What we are not optimizing for

- Hosted SaaS memory API (Mem0 competitor)
- Feature parity with Engram's full platform
- Semantic search in v1 (deferred to v1.1)

MemFOC stays narrow: **the LangGraph BaseStore adapter for Filecoin.**
