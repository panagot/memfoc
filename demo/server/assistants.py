"""MemFOC demo assistants — grant guide chat + UI design critic."""

from __future__ import annotations

import re
from typing import Any

SECTION_GUIDE: dict[str, str] = {
    "overview": "Overview covers the value proposition, live stats, and build status.",
    "use-cases": "Use cases show personalization, audit, multi-agent, and portability scenarios.",
    "architecture": "Architecture explains the SQLite hot path + FOC cold path + FVM manifest.",
    "process": "How it works walks through put → SQLite → FOC sync → manifest anchor.",
    "demo": "Guided demo is a 5-step judge-friendly walkthrough of the live prototype.",
    "console": "Live console shows the memory index, WebSocket sync feed, and seed demo data.",
    "agent": "Agent playground runs LangGraph-style memory writes against FilecoinStore.",
    "benchmarks": "Benchmarks measure sub-20ms local writes at 1–100 KB payload sizes.",
    "manifest": "Manifest & recovery covers flush, FVM anchoring, and rebuild_index().",
    "grant": "Grant roadmap details $7K ask, 10 weeks, and four milestones.",
}

NAV_HINTS = """
Primary nav (top): Overview · Architecture · Guided demo · Live console · Grant roadmap
Sidebar (left): Use cases · How it works · Agent playground · Benchmarks · Manifest
"""


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def assistant_reply(message: str, section: str | None = None) -> dict[str, Any]:
    q = _normalize(message)
    section = section or "overview"
    section_blurb = SECTION_GUIDE.get(section, "")

    if any(w in q for w in ("hello", "hi", "hey", "start")):
        reply = (
            "Welcome to MemFOC — verifiable LangGraph memory on Filecoin. "
            "I'm your grant-demo guide. Ask about architecture, the grant ask, "
            "how to run the demo, or how we compare to PostgresStore / Mem0."
        )
    elif "grant" in q or "money" in q or "funding" in q or "milestone" in q:
        reply = (
            "FIL Builder Next Step ask: **$7,000 over 10 weeks**. "
            "M1: FilecoinStore + tests ($2K). M2: Synapse backend ($2.5K). "
            "M3: MemoryManifest.sol on FVM ($1.5K). M4: Mainnet + PyPI ($1K). "
            "Open the **Grant roadmap** section for the full breakdown."
        )
    elif "rfs" in q or "mem0" in q or "engram" in q or "compet" in q or "postgres" in q:
        reply = (
            "**MemFOC** = native LangGraph BaseStore drop-in (unlike Engram tools or Mem0 API). "
            "Same ergonomics as PostgresStore, plus content-addressed FOC blobs and FVM manifest proofs. "
            "Filecoin RFS-1 explicitly wants decentralized agent memory adapters — we fill that gap."
        )
    elif "what is memfoc" in q or "what's memfoc" in q or q == "memfoc":
        reply = (
            "MemFOC is **PostgresStore, but durable and verifiable on Filecoin**. "
            "A LangGraph BaseStore implementation: immediate local consistency + "
            "eventual decentralized durability + periodic on-chain manifest anchoring."
        )
    elif "architect" in q or "sqlite" in q or " synapse" in q or q.startswith("foc "):
        reply = (
            "Hybrid architecture: **SQLite** for immediate reads/writes (<20ms), "
            "**FOC** for async content-addressed durability, **FVM** for periodic manifest anchoring "
            "(not per-write gas). See **Architecture** and **How it works** in the sidebar."
        )
    elif "demo" in q or "try" in q or "seed" in q or "walkthrough" in q:
        reply = (
            "Judge-friendly demo path: 1) Start API (`python -m demo.server.main`). "
            "2) Open **Guided demo** → follow 5 steps. 3) **Seed demo data** in Live console. "
            "4) Run **Agent playground** with `remember theme dark`. 5) **Flush manifest**."
        )
    elif "benchmark" in q or "latency" in q or "performance" in q or "fast" in q:
        reply = (
            "Hot path targets: put <20ms, get <5ms — all from SQLite. "
            "FOC sync is async (~120ms mock). Run **Benchmarks** from the sidebar "
            "to see live numbers at 1 KB / 10 KB / 100 KB."
        )
    elif "manifest" in q or "verify" in q or "audit" in q or "rebuild" in q:
        reply = (
            "Manifest snapshots list all memory CIDs. flush() uploads JSON to FOC "
            "and records a simulated FVM tx. rebuild_index() restores SQLite from "
            "the latest anchor — disaster recovery without replaying every write."
        )
    elif "install" in q or "run" in q or "start" in q or "api" in q:
        reply = (
            "```\npip install -e \".[demo,dev]\"\npython -m demo.server.main\n```\n"
            "Dashboard: `npm run dev` in demo/web. API at 127.0.0.1:8787."
        )
    elif "fvm" in q:
        reply = (
            "FVM manifest anchoring stores periodic snapshots on-chain — "
            "one tx per flush, not per memory write. See **Manifest & recovery**."
        )
    elif "nav" in q or "where" in q or "find" in q or "menu" in q:
        reply = f"You're on **{section}**. {section_blurb}\n\n{NAV_HINTS}"
    elif "design" in q or "ui" in q or "screenshot" in q or "optim" in q:
        reply = (
            "Use the **Grant Optimizer** (mint sparkle button, bottom-right) — "
            "it captures a screenshot, scores grant appeal on a 6-point rubric, "
            "and applies UI optimizations with one click."
        )
    else:
        ctx = f" (You're viewing: {section} — {section_blurb})" if section_blurb else ""
        reply = (
            f"I can help with MemFOC architecture, grant milestones, demo steps, "
            f"benchmarks, and navigation.{ctx}\n\n"
            "Try: \"What's the grant ask?\" · \"How does sync work?\" · \"Run the demo\""
        )

    return {"reply": reply, "agent": "memfoc-guide"}


def design_review(
    section: str,
    viewport_w: int = 0,
    viewport_h: int = 0,
    has_screenshot: bool = False,
) -> dict[str, Any]:
    """Heuristic UI audit for grant-demo polish — section-aware suggestions."""
    suggestions: list[dict[str, str]] = []

    def add(severity: str, title: str, detail: str) -> None:
        suggestions.append({"severity": severity, "title": title, "detail": detail})

    add(
        "info",
        "Grant-first narrative",
        "Lead every primary section with a one-line judge hook: "
        "\"Native BaseStore · FVM manifest · open source · RFS-1 aligned\".",
    )

    if section == "overview":
        add(
            "high",
            "Hero CTA hierarchy",
            "Keep \"Start guided demo\" as the single gold CTA; secondary actions as ghost pills. "
            "Judges scan for one obvious next step within 3 seconds.",
        )
        add(
            "medium",
            "Live stats credibility",
            "When API is connected, animate stat tiles on change — proves real backend, not mock UI.",
        )
    elif section == "grant":
        add(
            "high",
            "Milestone clarity",
            "Add calendar dates alongside week ranges. Judges compare timelines across applicants.",
        )
        add(
            "medium",
            "Budget breakdown visual",
            "A simple stacked bar ($2K + $2.5K + $1.5K + $1K) reads faster than text lists.",
        )
    elif section == "console":
        add(
            "high",
            "Empty state → action",
            "When no memories exist, embed a inline \"Seed demo\" button inside the table empty state.",
        )
        add(
            "medium",
            "Sync animation",
            "Pulse pending rows amber → mint on sync_complete WebSocket event for demo wow-factor.",
        )
    elif section == "demo":
        add(
            "medium",
            "Progress indicator",
            "Add a step progress bar (1/5 … 5/5) so judges know how long the walkthrough takes.",
        )
    elif section == "architecture":
        add(
            "medium",
            "Interactive diagram",
            "Hover states on architecture SVG layers could reveal latency numbers per layer.",
        )
    elif section == "use-cases":
        add(
            "medium",
            "Industry tags",
            "Add pill tags (FinTech, Health, SaaS) to each use case for faster judge scanning.",
        )

    if viewport_w and viewport_w < 768:
        add(
            "high",
            "Mobile grant review",
            "Many reviewers preview on phone. Ensure top nav collapses to hamburger with full section list.",
        )

    if has_screenshot:
        add(
            "info",
            "Screenshot captured",
            "Viewport captured successfully. Compare gold/mint contrast ratio on OLED displays — "
            "current palette reads well on dark backgrounds.",
        )

    add(
        "low",
        "Micro-motion",
        "Stagger section entry animations by 80ms per card — adds premium feel without slowing judges.",
    )

    score = max(72, 94 - len([s for s in suggestions if s["severity"] == "high"]) * 6)

    return {
        "agent": "design-critic",
        "section": section,
        "score": score,
        "summary": f"UI audit for «{section}» — {len(suggestions)} suggestions for grant-demo impact.",
        "suggestions": suggestions,
    }
