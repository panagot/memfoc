import { ARCHITECTURE_LAYERS } from "../data/docs";
import { ArchitectureFlow } from "../components/graphics/ArchitectureFlow";
import { BezelPanel } from "../components/ui/Bezel";
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

export function ArchitectureSection() {
  return (
    <div className="space-y-16 md:space-y-20">
      <SectionHeading
        eyebrow="Technical design"
        title="Hybrid storage architecture"
        description="Filecoin is object storage, not a KV database. MemFOC splits hot path (SQLite) from cold path (FOC) deliberately."
      />

      <BezelPanel padding={false}>
        <div className="overflow-visible p-4 md:p-6">
          <ArchitectureFlow />
        </div>
      </BezelPanel>

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
          The core store depends on a pluggable backend protocol. Local development uses a
          content-addressed local backend (~120ms local dev latency). Production uses{" "}
          <code className="text-mem-mint">SynapseBackend</code> via pynapse on Filecoin
          Onchain Cloud.
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
