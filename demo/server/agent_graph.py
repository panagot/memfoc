"""Minimal LangGraph demo graph compiled with FilecoinStore."""

from __future__ import annotations

from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from langgraph.store.base import BaseStore, GetOp, PutOp, SearchOp


class AgentState(TypedDict):
    message: str
    user_id: str
    reply: str


async def memory_node(state: AgentState, *, store: BaseStore) -> dict[str, str]:
    user_id = state["user_id"]
    message = state["message"].strip()
    if not message:
        return {"reply": "Send a non-empty message."}

    msg_key = f"turn-{abs(hash(message)) % 10_000_000}"
    await store.abatch(
        [
            PutOp(
                ("users", user_id, "conversation"),
                msg_key,
                {"role": "user", "text": message},
            )
        ]
    )

    lower = message.lower()
    if lower.startswith("remember theme "):
        theme = message.split("remember theme ", 1)[1].strip()
        await store.abatch(
            [PutOp(("users", user_id, "preferences"), "theme", {"value": theme})]
        )
        return {
            "reply": (
                f"Preference stored via LangGraph node. Theme set to '{theme}' "
                "(SQLite hot path, async FOC sync)."
            )
        }

    if lower == "what is my theme?":
        items = await store.abatch([GetOp(("users", user_id, "preferences"), "theme")])
        item = items[0]
        if item:
            return {
                "reply": (
                    f"Your saved theme is '{item.value.get('value')}' "
                    "(read from FilecoinStore inside the graph node)."
                )
            }
        return {"reply": "No theme saved yet. Try: remember theme dark"}

    history = await store.abatch(
        [SearchOp(("users", user_id, "conversation"), limit=5)]
    )
    count = len(history[0]) if history and history[0] else 0
    await store.abatch(
        [
            PutOp(
                ("agents", "memfoc-demo"),
                msg_key,
                {"summary": message[:120], "turns_seen": count + 1},
            )
        ]
    )
    return {
        "reply": (
            f"LangGraph node logged your message to FilecoinStore. "
            f"{count} prior turn(s) in users/{user_id}/conversation."
        )
    }


def build_demo_graph(store: BaseStore):
    graph = StateGraph(AgentState)
    graph.add_node("memory", memory_node)
    graph.add_edge(START, "memory")
    graph.add_edge("memory", END)
    return graph.compile(store=store)
