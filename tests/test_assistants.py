"""Unit tests for grant optimizer and assistant modules."""

import pytest

from demo.server.assistants import assistant_reply
from demo.server.grant_optimizer import grant_optimizer_analyze, grant_optimizer_full_audit


def test_assistant_grant_question():
    r = assistant_reply("What's the grant ask?", "grant")
    assert r["agent"] == "memfoc-guide"
    assert "$7" in r["reply"] or "7,000" in r["reply"]


def test_assistant_memfoc_intro():
    r = assistant_reply("what is memfoc", "overview")
    assert "BaseStore" in r["reply"] or "PostgresStore" in r["reply"]


def test_grant_optimizer_scoring():
    r = grant_optimizer_analyze(
        section="grant",
        viewport_w=1440,
        viewport_h=900,
        has_screenshot=True,
        api_online=True,
        dom={"has_budget_bar": True, "cta_count": 4},
    )
    assert r["agent"] == "grant-optimizer"
    assert 0 < r["score"] <= 100
    assert len(r["rubric"]) == 6
    assert r["can_apply"] is True


def test_grant_optimizer_apply_mode():
    r = grant_optimizer_analyze(
        section="overview",
        api_online=True,
        dom={"has_trust_badges": False},
        polish_active=True,
    )
    assert len(r["applied_fixes"]) > 0
    assert r["score"] >= r["score_before"]


def test_full_audit():
    r = grant_optimizer_full_audit(api_online=True)
    assert r["mode"] == "full_audit"
    assert "overview" in r["judge_path"]
    assert r["overall_readiness"] >= 60
