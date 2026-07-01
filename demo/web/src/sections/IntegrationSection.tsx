import { GitDiff, PlugsConnected } from "@phosphor-icons/react";
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

const POSTGRES = `# PostgresStore (centralized)
from langgraph.store.postgres import PostgresStore

store = PostgresStore.from_conn_string("postgresql://...")
graph = builder.compile(store=store)

# Agent node
await runtime.store.put(
    ("users", user_id, "preferences"), "theme", {"value": "dark"}
)`;

const MEMFOC = `# FilecoinStore (decentralized durability)
from memfoc.store import FilecoinStore

store = FilecoinStore()  # SQLite hot path + async FOC
graph = builder.compile(store=store)

# Same agent node — identical API
await runtime.store.put(
    ("users", user_id, "preferences"), "theme", {"value": "dark"}
)`;

export function IntegrationSection() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Developer UX"
        title="One-line integration"
        description="MemFOC implements LangGraph BaseStore — the same compile-time slot as PostgresStore and InMemoryStore."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="PostgresStore" subtitle="Centralized reference">
          <CodeBlock code={POSTGRES} />
          <ul className="mt-4 space-y-2 text-xs text-mem-muted">
            <li>Fast, mature, official LangGraph backend</li>
            <li>No content-addressed CIDs or independent verification</li>
            <li>Requires Postgres hosting and migration for portability</li>
          </ul>
        </Panel>

        <Panel title="FilecoinStore" subtitle="MemFOC drop-in">
          <CodeBlock code={MEMFOC} />
          <ul className="mt-4 space-y-2 text-xs text-mem-muted">
            <li>Same put/get/search namespace API</li>
            <li>SQLite &lt;20ms hot path; FOC sync is async</li>
            <li>Periodic FVM manifest for audit and disaster recovery</li>
          </ul>
        </Panel>
      </div>

      <Panel title="What changes in your agent code?">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-mem-line bg-void-inset px-4 py-3">
            <PlugsConnected className="h-8 w-8 text-mem-mint" weight="duotone" />
            <div>
              <p className="font-mono text-sm text-mem-frost">graph.compile(store=...)</p>
              <p className="text-xs text-mem-muted">Only the store constructor changes</p>
            </div>
          </div>
          <GitDiff className="hidden h-6 w-6 text-mem-muted md:block" weight="duotone" />
          <p className="text-sm text-mem-muted">
            Nodes keep using <code className="text-mem-mint">runtime.store.put</code> and{" "}
            <code className="text-mem-mint">runtime.store.get</code>. No tool wrappers, no manual
            FOC API calls inside the graph.
          </p>
        </div>
      </Panel>

      <Panel title="Runnable example">
        <p className="text-sm text-mem-muted">
          See <code className="text-mem-mint">examples/minimal_langgraph.py</code> in the repo — a
          real <code className="text-mem-mint">StateGraph</code> compiled with{" "}
          <code className="text-mem-mint">FilecoinStore()</code>.
        </p>
      </Panel>
    </div>
  );
}
