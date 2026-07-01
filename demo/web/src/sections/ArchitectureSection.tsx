import { ARCHITECTURE_LAYERS } from "../data/docs";
import { ArchitectureFlow } from "../components/graphics/ArchitectureFlow";
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

export function ArchitectureSection() {
  return (
    <div className="space-y-16 md:space-y-20">
      <SectionHeading
        eyebrow="Technical design"
        title="Hybrid storage architecture"
        description="Filecoin is object storage, not a KV database. MemFOC splits hot path (SQLite) from cold path (FOC) deliberately."
      />

      <Panel>
        <ArchitectureFlow />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {ARCHITECTURE_LAYERS.map((layer) => (
          <Panel key={layer.id}>
            <div className="flex items-start gap-4">
              <div
                className="mt-1 h-10 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-mem-muted">
                  {layer.subtitle}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-mem-frost">{layer.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mem-muted">{layer.detail}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <SectionHeading
        title="Integration code"
        description="Drop-in replacement for InMemoryStore or PostgresStore in LangGraph."
      />
      <CodeBlock
        code={`from langgraph.graph import StateGraph
from memfoc import FilecoinStore

store = FilecoinStore(
    db_path=".memfoc/index.db",
    storage_dir=".memfoc/blobs",
)

graph = builder.compile(
    checkpointer=checkpointer,
    store=store,  # same API as PostgresStore
)

# Inside any node:
def remember(state, runtime):
    runtime.store.put(
        ("users", state["user_id"], "prefs"),
        "theme",
        {"value": "dark"},
    )`}
      />

      <Panel title="StorageBackend abstraction">
        <p className="mb-4 text-sm text-mem-muted">
          The core store depends on a pluggable backend protocol. Localhost uses{" "}
          <code className="text-mem-mint">MockFOCBackend</code> (~120ms simulated latency).
          Production uses <code className="text-mem-mint">SynapseBackend</code> via pynapse on
          Calibration or mainnet.
        </p>
        <CodeBlock
          code={`class StorageBackend(Protocol):
    async def upload(payload: dict) -> UploadResult: ...
    async def download(cid: str) -> dict: ...`}
        />
      </Panel>
    </div>
  );
}
