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
  const [input, setInput] = useState("Remember that I prefer dark mode and work in UTC+2");

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="LangGraph demo"
        title="Agent memory loop"
        description="Run a sample graph node that writes to FilecoinStore. Memories appear in the console and sync to FOC in the background."
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
          <button
            type="button"
            disabled={running}
            onClick={() => onRun(input)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-mem-gold px-5 py-3 text-sm font-semibold text-void disabled:opacity-50"
          >
            <Robot className="h-4 w-4" weight="duotone" />
            {running ? "Running graph…" : "Run agent"}
          </button>
        </Panel>

        <Panel title="What happens under the hood">
          <ol className="space-y-3 text-sm text-mem-muted">
            <li>1. LangGraph node receives state + runtime store handle</li>
            <li>2. <code className="text-mem-mint">store.put()</code> writes to SQLite immediately</li>
            <li>3. SyncWorker enqueues FOC upload (non-blocking)</li>
            <li>4. Index row updates to <span className="text-emerald-300">synced</span> with CID</li>
          </ol>
          <CodeBlock
            code={`# demo/server/main.py — simplified
@app.post("/api/agent/run")
async def run_agent(body: AgentRequest):
    result = await demo_graph.ainvoke({"input": body.message})
    return {"messages": result["messages"]}`}
          />
        </Panel>
      </div>

      <Panel title="Conversation trace">
        {messages.length === 0 ? (
          <p className="text-sm text-mem-muted">Run the agent to see tool calls and memory writes.</p>
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
            ["users", "alice", "prefs", "theme: dark"],
            ["sessions", "sess_01", "context", "last topic: Filecoin"],
            ["agents", "memfoc", "facts", "grant target: $7K"],
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
          Namespaces follow LangGraph BaseStore tuple convention
        </p>
      </Panel>
    </div>
  );
}
