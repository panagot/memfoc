"""Grant Optimizer — independent agent for FIL Builder demo polish."""

from __future__ import annotations

from typing import Any

from demo.server.assistants import SECTION_GUIDE

GRANT_RUBRIC = [
    ("value_prop", "Value proposition clarity", 20),
    ("technical_proof", "Technical credibility", 20),
    ("live_demo", "Live demo readiness", 15),
    ("grant_fit", "FIL Builder / RFS-1 alignment", 20),
    ("visual_impact", "Visual impact & polish", 15),
    ("call_to_action", "Judge call-to-action path", 10),
]

SECTION_FIXES: dict[str, list[dict[str, str]]] = {
    "overview": [
        {"id": "trust_badges", "title": "Trust badges", "detail": "RFS-1 · BaseStore · FVM manifest pills under hero"},
        {"id": "judge_tour", "title": "Judge tour banner", "detail": "60-second reviewer path pinned at top"},
        {"id": "live_pulse", "title": "Live stat pulse", "detail": "Stats animate when API pushes updates"},
    ],
    "grant": [
        {"id": "budget_bar", "title": "Budget visualization", "detail": "$2K+$2.5K+$1.5K+$1K stacked funding bar"},
        {"id": "why_fund", "title": "Why fund this", "detail": "Three judge hooks: gap, prototype, alignment"},
        {"id": "rfs_callout", "title": "RFS-1 callout", "detail": "Explicit Filecoin agent memory requirement mapping"},
    ],
    "demo": [
        {"id": "progress_bar", "title": "Demo progress", "detail": "5-step progress indicator for reviewer time budget"},
    ],
    "console": [
        {"id": "empty_cta", "title": "Empty-state CTA", "detail": "Inline seed button when no memories exist"},
        {"id": "sync_highlight", "title": "Sync highlights", "detail": "Pending rows pulse until synced"},
    ],
    "use-cases": [
        {"id": "industry_tags", "title": "Industry tags", "detail": "FinTech · Health · SaaS · Research pills"},
    ],
    "architecture": [
        {"id": "latency_labels", "title": "Latency callouts", "detail": "<20ms hot path emphasized on diagram"},
    ],
}

GLOBAL_FIXES = [
    {"id": "grant_pitch_strip", "title": "Grant pitch strip", "detail": "Persistent one-liner visible during judge mode"},
    {"id": "emphasis_glow", "title": "CTA emphasis", "detail": "Primary buttons get subtle gold glow in judge mode"},
]


def _score_section(section: str, dom: dict[str, Any], api_online: bool) -> dict[str, Any]:
    scores: dict[str, int] = {}
    h1 = dom.get("h1_count", 0)
    cta = dom.get("cta_count", 0)
    has_empty = dom.get("has_empty_state", False)

    scores["value_prop"] = 16 if section in ("overview", "grant") else 12
    if dom.get("has_trust_badges"):
        scores["value_prop"] = min(20, scores["value_prop"] + 4)

    scores["technical_proof"] = 14 if api_online else 8
    if section in ("console", "benchmarks", "agent") and api_online:
        scores["technical_proof"] = 18
    if dom.get("has_code_block"):
        scores["technical_proof"] = min(20, scores["technical_proof"] + 2)

    scores["live_demo"] = 10 if api_online else 4
    if section in ("demo", "console") and api_online:
        scores["live_demo"] = 15
    if section == "demo" and dom.get("has_progress"):
        scores["live_demo"] = 15

    scores["grant_fit"] = 12
    if section == "grant":
        scores["grant_fit"] = 18
    if section == "overview" and dom.get("has_trust_badges"):
        scores["grant_fit"] = 16

    scores["visual_impact"] = 12
    if dom.get("viewport_w", 1024) >= 1024:
        scores["visual_impact"] = 15

    scores["call_to_action"] = 6 if cta >= 2 else 4
    if section in ("overview", "demo", "grant") and cta >= 1:
        scores["call_to_action"] = 9

    total = sum(scores.values())
    max_total = sum(w for _, _, w in GRANT_RUBRIC)

    return {
        "scores": scores,
        "total": total,
        "max": max_total,
        "percent": round(total / max_total * 100),
    }


def grant_optimizer_analyze(
    section: str,
    viewport_w: int = 0,
    viewport_h: int = 0,
    has_screenshot: bool = False,
    api_online: bool = True,
    dom: dict[str, Any] | None = None,
    polish_active: bool = False,
) -> dict[str, Any]:
    dom = dom or {}
    scoring = _score_section(section, dom, api_online)

    suggestions: list[dict[str, str]] = []
    applicable_fixes: list[dict[str, str]] = []
    applied: list[dict[str, str]] = []

    def suggest(severity: str, title: str, detail: str) -> None:
        suggestions.append({"severity": severity, "title": title, "detail": detail})

    # Section-specific recommendations
    if section == "overview" and not dom.get("has_trust_badges"):
        suggest("high", "Add trust badges", "Judges scan for RFS-1, BaseStore, and FVM in first 5 seconds.")
        applicable_fixes.extend(SECTION_FIXES.get("overview", []))

    if section == "grant" and not dom.get("has_budget_bar"):
        suggest("high", "Visualize the budget", "Stacked $7K breakdown beats a text-only milestone list.")
        applicable_fixes.extend(SECTION_FIXES.get("grant", []))

    if section == "console" and dom.get("has_empty_state"):
        suggest("high", "Empty console kills credibility", "Embed Seed demo CTA inside the empty table.")
        applicable_fixes.extend(SECTION_FIXES.get("console", []))

    if section == "demo" and not dom.get("has_progress"):
        suggest("medium", "Show demo progress", "Judges want to know the walkthrough is 5 steps, ~3 minutes.")
        applicable_fixes.extend(SECTION_FIXES.get("demo", []))

    if not api_online:
        suggest("high", "API offline", "Grant reviewers must see live sync. Start python -m demo.server.main.")

    if not has_screenshot:
        suggest("info", "Capture screenshot", "Screenshot enables visual contrast and layout audit.")

    if viewport_w and viewport_w < 768:
        suggest("medium", "Mobile preview", "Test grant page on phone — many reviewers skim on mobile.")

    suggest(
        "info",
        "Judge path",
        "Optimal flow: Overview → Guided demo → Live console → Grant roadmap (~4 min).",
    )

    # Fixes available for this section
    section_fixes = SECTION_FIXES.get(section, [])
    for fix in section_fixes:
        if fix not in applicable_fixes:
            applicable_fixes.append(fix)

    if polish_active:
        applied = applicable_fixes + [f for f in GLOBAL_FIXES if f["id"] != "emphasis_glow"]
        applied.append(GLOBAL_FIXES[1])  # emphasis_glow
        scoring_after = min(scoring["max"], scoring["total"] + len(applied) * 2)
        score_percent = round(scoring_after / scoring["max"] * 100)
    else:
        score_percent = scoring["percent"]

    blurb = SECTION_GUIDE.get(section, "")

    return {
        "agent": "grant-optimizer",
        "section": section,
        "score": score_percent,
        "score_before": scoring["percent"],
        "rubric": [
            {"id": k, "label": label, "weight": w, "score": scoring["scores"].get(k, 0)}
            for k, label, w in GRANT_RUBRIC
        ],
        "summary": (
            f"Grant appeal audit for «{section}» — {score_percent}/100. "
            f"{blurb}"
        ),
        "suggestions": suggestions,
        "applicable_fixes": applicable_fixes,
        "applied_fixes": applied if polish_active else [],
        "can_apply": len(applicable_fixes) > 0 and not polish_active,
        "screenshot_received": has_screenshot,
    }


def grant_optimizer_full_audit(api_online: bool = True) -> dict[str, Any]:
    """Meta-audit across all sections for judge readiness."""
    sections = list(SECTION_GUIDE.keys())
    priorities = [
        {"section": "overview", "reason": "First impression — value prop + trust signals", "priority": 1},
        {"section": "demo", "reason": "Proves you ship, not just slide-ware", "priority": 2},
        {"section": "console", "reason": "Live FOC sync is the wow moment", "priority": 3},
        {"section": "grant", "reason": "Milestones, budget, and RFS-1 alignment", "priority": 4},
        {"section": "architecture", "reason": "Technical depth for engineer reviewers", "priority": 5},
    ]
    return {
        "agent": "grant-optimizer",
        "mode": "full_audit",
        "sections_total": len(sections),
        "api_online": api_online,
        "judge_path": [p["section"] for p in priorities],
        "priorities": priorities,
        "overall_readiness": 88 if api_online else 62,
        "headline": "MemFOC is grant-demo ready" if api_online else "Start API to unlock full demo impact",
    }
