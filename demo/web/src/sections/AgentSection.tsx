import { useState } from "react";
import { PaperPlaneTilt, Robot } from "@phosphor-icons/react";
type AgentMessage = { role: "user" | "agent"; content: string };
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

export function AgentSection({
  messages,
  running,
  onRun,
}: {
  messages: AgentMessage[];
  running: boolean;
  onRun: (input: string) => void;
}) {
  const [input, setInput] = useState("remember theme dark");

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="LangGraph"
        title="Real graph + FilecoinStore"
        description="Runs a compiled StateGraph with store=FilecoinStore(). The memory node uses the same BaseStore API as PostgresStore."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Try it">
          <label className="mb-2 block text-xs uppercase tracking-wider text-mem-muted">
            User message
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-mem-line bg-void px-4 py-3 text-sm text-mem-frost outline-none focus:border-mem-gold/50"
          />
          <p className="mt-2 text-xs text-mem-muted">
            Try: <code className="text-mem-mint">remember theme dark</code> then{" "}
            <code className="text-mem-mint">what is my theme?</code>
          </p>
          <button
            type="button"
            disabled={running}
            onClick={() => onRun(input)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-mem-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-mem-gold-dim disabled:opacity-50"
          >
            <Robot className="h-4 w-4" weight="duotone" />
            {running ? "Running graph…" : "Run LangGraph node"}
          </button>
        </Panel>

        <Panel title="What happens under the hood">
          <ol className="space-y-3 text-sm text-mem-muted">
            <li>1. API builds graph via <code className="text-mem-mint">build_demo_graph(store)</code></li>
            <li>2. Node receives <code className="text-mem-mint">store: BaseStore</code> from LangGraph runtime</li>
            <li>3. <code className="text-mem-mint">store.abatch([PutOp(...)])</code> writes to SQLite</li>
            <li>4. SyncWorker uploads to FOC asynchronously</li>
          </ol>
          <CodeBlock
            code={`# demo/server/agent_graph.py
graph = StateGraph(AgentState)
graph.add_node("memory", memory_node)
demo_graph = graph.compile(store=FilecoinStore())

result = await demo_graph.ainvoke({
    "message": "remember theme dark",
    "user_id": "demo-user",
    "reply": "",
})`}
          />
        </Panel>
      </div>

      <Panel title="Conversation trace">
        {messages.length === 0 ? (
          <p className="text-sm text-mem-muted">
            Run the graph to see memory writes appear in the Live console.
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-mem-gold/15 text-mem-frost"
                      : "border border-mem-line bg-void text-mem-muted"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Example memory namespaces">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["users", "demo-user", "preferences", "theme: dark"],
            ["users", "demo-user", "conversation", "turn history"],
            ["agents", "memfoc-demo", "facts", "storage: filecoin"],
          ].map(([a, b, c, d]) => (
            <div key={`${a}-${b}-${c}`} className="rounded-xl border border-mem-line/70 p-4">
              <p className="font-mono text-xs text-mem-mint">
                ({a}, {b}, {c})
              </p>
              <p className="mt-2 text-sm text-mem-frost">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-mem-muted">
          <PaperPlaneTilt className="h-4 w-4" />
          Same example in <code className="text-mem-mint">examples/minimal_langgraph.py</code>
        </p>
      </Panel>
    </div>
  );
}
