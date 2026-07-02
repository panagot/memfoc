"""MemFOC demo assistant — product and architecture guide."""

from __future__ import annotations

import re
from typing import Any

SECTION_GUIDE: dict[str, str] = {
    "overview": "Overview covers the value proposition, live stats, and architecture preview.",
    "use-cases": "Use cases show personalization, audit, multi-agent, and portability scenarios.",
    "architecture": "Architecture explains the SQLite hot path + FOC cold path + FVM manifest.",
    "process": "How it works walks through put → SQLite → FOC sync → manifest anchor.",
    "demo": "Guided demo is a step-by-step walkthrough of the live dashboard.",
    "console": "Live console shows the memory index, WebSocket sync feed, and seed demo data.",
    "agent": "Agent playground runs a LangGraph graph compiled with FilecoinStore.",
    "benchmarks": "Benchmarks measure sub-20ms local writes at 1–100 KB payload sizes.",
    "manifest": "Manifest & recovery covers flush, anchoring, and rebuild_index().",
    "roadmap": "Roadmap shows shipped vs planned work and release phases.",
    "integration": "Integration compares PostgresStore vs FilecoinStore drop-in code.",
}

NAV_HINTS = """
Primary nav: Overview · Architecture · Guided demo · Live console · Roadmap
Sidebar: Integration · Use cases · How it works · Agent playground · Benchmarks · Manifest
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
            "Ask about architecture, integration, the live demo, or how we compare to "
            "PostgresStore, Mem0, and Engram."
        )
    elif "grant" in q or "money" in q or "funding" in q:
        reply = (
            "Grant and budget details live in **docs/GRANT.md** on GitHub. "
            "This demo focuses on the product: FilecoinStore, sync, manifest recovery, "
            "and the LangGraph integration path. Open **Roadmap** for shipped vs planned work."
        )
    elif "milestone" in q or "roadmap" in q or "planned" in q or "shipped" in q:
        reply = (
            "Open **Roadmap** for architecture status: FilecoinStore, local FOC backend, and "
            "this dashboard are shipped. Next phases cover Synapse integration, "
            "MemoryManifest.sol, and PyPI release."
        )
    elif "rfs" in q or "mem0" in q or "engram" in q or "compet" in q or "postgres" in q:
        reply = (
            "**MemFOC** is a native LangGraph BaseStore drop-in (unlike Engram tools or Mem0 API). "
            "Same ergonomics as PostgresStore, plus content-addressed FOC blobs and FVM manifest proofs. "
            "See **Integration** and **Roadmap** for positioning."
        )
    elif "what is memfoc" in q or "what's memfoc" in q or q == "memfoc":
        reply = (
            "MemFOC is **PostgresStore semantics on verifiable Filecoin storage**. "
            "A LangGraph BaseStore implementation: immediate local consistency, "
            "eventual decentralized durability, and periodic manifest anchoring."
        )
    elif "architect" in q or "sqlite" in q or " synapse" in q or q.startswith("foc "):
        reply = (
            "Hybrid architecture: **SQLite** for immediate reads/writes (<20ms), "
            "**FOC** for async content-addressed durability, **FVM** for periodic manifest anchoring "
            "(not per-write gas). See **Architecture** and **How it works**."
        )
    elif "demo" in q or "try" in q or "seed" in q or "walkthrough" in q:
        reply = (
            "Quick demo path: 1) Start API (`python -m demo.server.main`). "
            "2) Open **Guided demo**. 3) **Seed demo data** in Live console. "
            "4) Run **Agent playground** with `remember theme dark`. 5) **Flush manifest**."
        )
    elif "benchmark" in q or "latency" in q or "performance" in q or "fast" in q:
        reply = (
            "Hot path targets: put <20ms, get <5ms — all from SQLite. "
            "FOC sync is async (~120ms in the local backend). Run **Benchmarks** "
            "for live numbers at 1 KB / 10 KB / 100 KB."
        )
    elif "manifest" in q or "verify" in q or "audit" in q or "rebuild" in q:
        reply = (
            "Manifest snapshots list all memory CIDs. flush() uploads JSON to FOC "
            "and records an anchor tx (simulated locally). rebuild_index() restores SQLite from "
            "the latest manifest — disaster recovery without replaying every write."
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
    elif "design" in q or "ui" in q or "screenshot" in q:
        reply = (
            "This dashboard is a live product demo for MemFOC — architecture, console, "
            "agent playground, benchmarks, and manifest recovery. "
            "Use **Guided demo** for a structured walkthrough."
        )
    else:
        ctx = f" (You're viewing: {section} — {section_blurb})" if section_blurb else ""
        reply = (
            f"I can help with MemFOC architecture, integration, demo steps, "
            f"benchmarks, and navigation.{ctx}\n\n"
            "Try: \"How does sync work?\" · \"Compare to PostgresStore\" · \"Run the demo\""
        )

    return {"reply": reply, "agent": "memfoc-guide"}


def design_review(
    section: str,
    viewport_w: int = 0,
    viewport_h: int = 0,
    has_screenshot: bool = False,
) -> dict[str, Any]:
    """Heuristic UI audit for demo polish — section-aware suggestions."""
    suggestions: list[dict[str, str]] = []

    def add(severity: str, title: str, detail: str) -> None:
        suggestions.append({"severity": severity, "title": title, "detail": detail})

    if section == "overview":
        add(
            "high",
            "Hero CTA hierarchy",
            "Keep \"Start guided demo\" as the primary action; secondary links as ghost buttons.",
        )
        add(
            "medium",
            "Live stats credibility",
            "When API is connected, stat tiles should reflect real store state.",
        )
    elif section == "roadmap":
        add(
            "medium",
            "Roadmap clarity",
            "Shipped vs planned panels should stay scannable without budget or grant framing.",
        )
    elif section == "console":
        add(
            "high",
            "Empty state → action",
            "When no memories exist, keep the inline \"Seed demo\" button prominent.",
        )
    elif section == "demo":
        add(
            "medium",
            "Progress indicator",
            "Step progress helps users know how long the walkthrough takes.",
        )

    if viewport_w and viewport_w < 768:
        add(
            "high",
            "Mobile layout",
            "Ensure top nav collapses cleanly and primary actions remain reachable on small screens.",
        )

    if has_screenshot:
        add(
            "info",
            "Screenshot captured",
            "Viewport captured successfully for section review.",
        )

    score = max(72, 94 - len([s for s in suggestions if s["severity"] == "high"]) * 6)

    return {
        "agent": "design-critic",
        "section": section,
        "score": score,
        "summary": f"UI audit for «{section}» — {len(suggestions)} suggestions.",
        "suggestions": suggestions,
    }
