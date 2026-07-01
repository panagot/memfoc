export const PRODUCT_TAGLINE =
  "PostgresStore semantics — with content-addressed durability and on-chain verification on Filecoin.";

export const HERO_HEADLINE =
  "MemFOC brings decentralized long-term memory to LangGraph agents.";

export const HERO_SUBHEAD =
  "Use Filecoin as a drop-in replacement for PostgresStore — same BaseStore API, verifiable storage, on-chain auditability.";

export const HERO_CODE = `from memfoc import FilecoinStore

graph = builder.compile(store=FilecoinStore())`;

export const HERO_WHY = [
  "Same API as PostgresStore",
  "Memory survives restarts",
  "Stored on Filecoin (FOC)",
  "Verifiable on-chain (FVM)",
];

export const RECOVERY_INVARIANT =
  "SQLite loss is recoverable from the latest anchored manifest + FOC blobs.";

export const VALUE_PROPS = [
  {
    title: "Drop-in BaseStore",
    stat: "1 line",
    body: "Replace InMemoryStore or PostgresStore with graph.compile(store=FilecoinStore()). No tool wrappers, no API calls inside nodes.",
  },
  {
    title: "Sub-20ms writes",
    stat: "<20ms",
    body: "SQLite hot path keeps agent loops fast. FOC upload happens asynchronously — never blocking your graph.",
  },
  {
    title: "Verifiable CIDs",
    stat: "PDP",
    body: "Every memory blob is content-addressed on Filecoin Onchain Cloud. Manifest snapshots anchor state on FVM.",
  },
  {
    title: "Disaster recovery",
    stat: "rebuild",
    body: "Lost your index? rebuild_index() walks the latest manifest and restores SQLite from FOC blobs.",
  },
];

export const USE_CASES = [
  {
    id: "personalization",
    title: "Long-running agent personalization",
    icon: "user",
    problem:
      "Support bots and copilots need preferences, history, and context across sessions — but centralized DBs don't survive vendor changes.",
    solution:
      "MemFOC namespaces like (users, id, preferences) persist as CIDs on Filecoin. Any deployment can rebuild the index from manifest.",
    example: '("users", "alice", "preferences") → theme: dark',
  },
  {
    id: "audit",
    title: "Auditable AI memory",
    icon: "shield",
    problem:
      "Regulated industries need proof that agent decisions were based on specific stored facts at a point in time.",
    solution:
      "Periodic manifest anchoring creates an immutable snapshot. Third parties verify CIDs without trusting your server.",
    example: "SnapshotCommitted(manifestHash, manifestCID)",
  },
  {
    id: "multi-agent",
    title: "Multi-agent shared memory",
    icon: "graph",
    problem:
      "Research agents, planner/executor pairs, and swarms need shared namespaces with consistent read-your-writes semantics.",
    solution:
      "LangGraph BaseStore namespace tuples let agents share (project, id, facts) while each write syncs independently to FOC.",
    example: '("agents", "planner", "plan") + ("agents", "executor", "tasks")',
  },
  {
    id: "portable",
    title: "Portable agent deployments",
    icon: "cloud",
    problem:
      "Moving agents between cloud, edge, or self-hosted infra means migrating Postgres — or losing memory entirely.",
    solution:
      "FOC is the durable layer. SQLite is a local cache. Ship the same store config anywhere; sync picks up where it left off.",
    example: "FilecoinStore(db_path=..., backend=SynapseBackend())",
  },
];

export const DEMO_WALKTHROUGH = [
  {
    step: 1,
    title: "Seed demo memories",
    section: "console" as const,
    detail:
      "Creates three namespace entries — user preferences, agent capabilities, and profile data. Watch sync_status flip from pending to synced.",
    action: "Seed demo data",
  },
  {
    step: 2,
    title: "Run the agent",
    section: "agent" as const,
    detail:
      'Try "remember theme dark" then "what is my theme?" — the graph writes to FilecoinStore and reads back from SQLite instantly.',
    action: "Open agent playground",
  },
  {
    step: 3,
    title: "Watch live sync",
    section: "console" as const,
    detail:
      "WebSocket feed shows sync_start and sync_complete events. Sync log records upload duration per key.",
    action: "View WebSocket feed",
  },
  {
    step: 4,
    title: "Benchmark hot path",
    section: "benchmarks" as const,
    detail: "Measure put/get at 1 KB, 10 KB, 100 KB. Local writes stay under 20ms regardless of FOC latency.",
    action: "Run benchmark",
  },
  {
    step: 5,
    title: "Anchor manifest",
    section: "manifest" as const,
    detail:
      "Flush commits all synced CIDs into a manifest snapshot. Simulated FVM tx hash appears in stats.",
    action: "Flush manifest",
  },
];

export const BUILDING_NOW = [
  {
    status: "done",
    item: "FilecoinStore (BaseStore)",
    detail: "abatch, async FOC sync, SQLite index",
  },
  {
    status: "done",
    item: "Prototype FOC backend",
    detail: "Content-addressed blobs — same CID semantics as Synapse (M2)",
  },
  {
    status: "done",
    item: "Demo API + dashboard",
    detail: "FastAPI + this interactive site",
  },
  {
    status: "grant",
    item: "SynapseBackend (pynapse)",
    detail: "Real FOC uploads on Calibration testnet",
  },
  {
    status: "grant",
    item: "MemoryManifest.sol",
    detail: "FVM contract for periodic anchoring",
  },
  {
    status: "grant",
    item: "PyPI release + mainnet",
    detail: "pip install memfoc on mainnet FOC",
  },
];

export const PROBLEM_POINTS = [
  {
    title: "Centralized memory backends",
    body: "PostgresStore and RedisStore tie agent memory to infrastructure you operate. Restarts, migrations, and vendor lock-in break portability.",
  },
  {
    title: "Tool-based integrations fall short",
    body: "SDKs like Engram expose store/retrieve tools, but LangGraph expects graph.compile(store=...) — a native BaseStore plug-in, not manual API calls in every node.",
  },
  {
    title: "No verifiable durability",
    body: "Traditional databases cannot produce content-addressed proofs that memory existed at a point in time. Filecoin PDP + manifest anchoring fills that gap.",
  },
];

export const ARCHITECTURE_LAYERS = [
  {
    id: "langgraph",
    title: "LangGraph Runtime",
    subtitle: "BaseStore interface",
    detail:
      "Agents call runtime.store.put, get, search with namespace tuples and JSON values — identical to PostgresStore ergonomics.",
    color: "#E3B341",
  },
  {
    id: "sqlite",
    title: "SQLite Index",
    subtitle: "Immediate consistency",
    detail:
      "Every read and write hits local SQLite first (<20ms). Sync status, CIDs, and namespace prefixes enable fast search without waiting on FOC.",
    color: "#1DE9B6",
  },
  {
    id: "foc",
    title: "Filecoin Onchain Cloud",
    subtitle: "Eventual durability",
    detail:
      "Background worker uploads JSON payloads as content-addressed blobs via Synapse (mock on localhost). PDP proofs and USDFC payments apply on testnet/mainnet.",
    color: "#7AB8FF",
  },
  {
    id: "fvm",
    title: "FVM Manifest",
    subtitle: "Periodic anchoring",
    detail:
      "Instead of gas on every put, periodic manifest snapshots are anchored on-chain. Third parties can verify memory state independently.",
    color: "#F0D078",
  },
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Agent writes memory",
    summary: "LangGraph node calls store.put with namespace, key, and JSON value.",
    detail:
      "The write returns immediately. The agent never blocks on network upload. This matches how production agents loop — dozens of writes per session.",
    latency: "< 20 ms",
    code: `await runtime.store.put(
  ("users", user_id, "preferences"),
  "theme",
  {"value": "dark", "source": "agent"}
)`,
  },
  {
    step: "02",
    title: "SQLite indexes the item",
    summary: "Local row created with sync_status = pending and updated_at timestamp.",
    detail:
      "Prefix search, namespace listing, and exact get all resolve from SQLite. The index is the source of truth for interactive agent execution.",
    latency: "< 10 ms read",
    code: `-- memories table
namespace | key | value | cid | sync_status | updated_at`,
  },
  {
    step: "03",
    title: "Background worker syncs to FOC",
    summary: "Async upload produces a content-addressed CID; row marked synced.",
    detail:
      "Retries on failure. WebSocket events broadcast sync_complete to the dashboard. On localhost, MockFOCBackend simulates ~120ms upload latency.",
    latency: "~120 ms (mock)",
    code: `payload → SHA256 → bafkreih...
.blob stored in .memfoc/blobs/`,
  },
  {
    step: "04",
    title: "Manifest anchor (periodic)",
    summary: "flush() uploads manifest JSON and records simulated on-chain tx.",
    detail:
      "Manifest lists all synced CIDs. FVM contract emits SnapshotCommitted. Enables disaster recovery via rebuild_index() without replaying every write.",
    latency: "On demand",
    code: `SnapshotCommitted(
  manifestHash,
  manifestCID
)`,
  },
];

export const GRANT_MILESTONES = [
  {
    id: "M1",
    title: "Hardening + CI",
    weeks: "Weeks 1–3 · Jul–Aug 2026 · $2,000",
    description:
      "Expand tests, CI, and Calibration-ready packaging on the existing FilecoinStore prototype.",
    deliverables: [
      "Expanded pytest (delete, search, manifest, rebuild)",
      "GitHub Actions CI",
      "Calibration-ready package structure",
      "Mock vs production backend docs",
    ],
  },
  {
    id: "M2",
    title: "Synapse + production worker",
    weeks: "Weeks 4–6 · Aug–Sep 2026 · $2,500",
    description: "Replace mock uploads with pynapse SynapseBackend on Filecoin testnet.",
    deliverables: [
      "SynapseBackend implementation",
      "USDFC payment flow docs",
      "Namespace prefix search polish",
      "WebSocket observability hooks",
    ],
  },
  {
    id: "M3",
    title: "FVM manifest contract",
    weeks: "Weeks 7–8 · Sep 2026 · $1,500",
    description: "On-chain manifest anchoring and disaster recovery via rebuild_index().",
    deliverables: [
      "MemoryManifest.sol on Calibration",
      "flush_manifest() → FVM tx",
      "rebuild_index() from anchored manifest",
      "Verification guide for third parties",
    ],
  },
  {
    id: "M4",
    title: "Mainnet + release",
    weeks: "Weeks 9–10 · Sep–Oct 2026 · $1,000",
    description: "Production deploy, PyPI package, and grant demo video.",
    deliverables: [
      "Mainnet Synapse + FVM deploy",
      "PyPI publish (memfoc)",
      "LangGraph example in examples/",
      "5-min demo walkthrough video",
    ],
  },
];

export const GRANT_WHY_FUND = [
  {
    stat: "Gap",
    title: "No BaseStore → Filecoin adapter exists",
    body: "RFS-1 asks for decentralized agent memory. Engram uses tools; Mem0 is centralized. MemFOC is the native LangGraph plug-in.",
  },
  {
    stat: "Ship",
    title: "Working prototype today",
    body: "Not a deck — live API, WebSocket sync, benchmarks, and tests in repo. Grant funds testnet FOC + FVM, not starting from zero.",
  },
  {
    stat: "Fit",
    title: "FVM + open source required",
    body: "MemoryManifest.sol, Calibration + mainnet, PyPI package. Every FIL Builder checkbox covered in milestones.",
  },
];

export const RFS_ALIGNMENT = [
  {
    requirement: "Decentralized agent memory (Mem0 alternative)",
    memfoc_answer: "Content-addressed FOC blobs + periodic FVM manifest — not a hosted API.",
  },
  {
    requirement: "Drop-in adapter for agent frameworks",
    memfoc_answer: "FilecoinStore implements LangGraph BaseStore — graph.compile(store=...).",
  },
  {
    requirement: "Verifiable storage proofs",
    memfoc_answer: "PDP on FOC + manifest root_hash anchored on-chain for independent audit.",
  },
  {
    requirement: "Production-grade developer UX",
    memfoc_answer: "SQLite hot path (<20ms), async sync, rebuild_index() disaster recovery.",
  },
];

export const USE_CASE_TAGS: Record<string, string[]> = {
  personalization: ["SaaS", "Support AI"],
  audit: ["FinTech", "Health", "Legal"],
  "multi-agent": ["Research", "Automation"],
  portable: ["Edge", "Multi-cloud"],
};

export const COMPETITOR_MATRIX = [
  {
    name: "MemFOC (this project)",
    basestore: true,
    decentralized: true,
    layer: "LangGraph storage adapter",
    notes: "Native BaseStore drop-in; SQLite hot path + FOC + FVM manifest",
  },
  {
    name: "PostgresStore",
    basestore: true,
    decentralized: false,
    layer: "Database backend",
    notes: "Official LangGraph backend; centralized, no content proofs",
  },
  {
    name: "Engram SDK",
    basestore: false,
    decentralized: true,
    layer: "Decentralized memory platform",
    notes: "LangChain tools — valuable platform; different integration model",
  },
  {
    name: "Mem0",
    basestore: false,
    decentralized: false,
    layer: "Memory intelligence layer",
    notes: "Hosted API; centralized memory layer",
  },
  {
    name: "foc-storage-mcp",
    basestore: false,
    decentralized: true,
    layer: "File upload MCP",
    notes: "File upload MCP only; no LangGraph memory semantics",
  },
];

export const PRODUCT_LAYERS = [
  { product: "PostgresStore", layer: "Database backend" },
  { product: "Mem0", layer: "Memory intelligence layer" },
  { product: "Engram", layer: "Decentralized memory platform" },
  { product: "MemFOC", layer: "LangGraph-native storage adapter" },
];

export const GRANT_UNLOCKS = [
  {
    milestone: "M2 · $2.5K",
    title: "Synapse on Calibration",
    body: "Real FOC uploads via pynapse; USDFC payment docs; live CIDs in dashboard.",
  },
  {
    milestone: "M3 · $1.5K",
    title: "MemoryManifest.sol",
    body: "FVM contract deployment; real flush txs; third-party verification guide.",
  },
  {
    milestone: "M4 · $1K",
    title: "Mainnet + PyPI",
    body: "pip install memfoc; LangGraph example; demo video for grant reporting.",
  },
];

export const SUCCESS_METRICS = [
  { metric: "PyPI installs (90 days)", target: "500+" },
  { metric: "GitHub stars", target: "50+" },
  { metric: "External tutorials / forks", target: "3+" },
  { metric: "Testnet agents documented", target: "5+" },
];

export const TYPICAL_BENCHMARKS = [
  { metric: "put latency (1 KB)", value: "~4 ms", note: "SQLite abatch" },
  { metric: "get latency", value: "~1 ms", note: "Exact key lookup" },
  { metric: "prefix search", value: "~8 ms", note: "Namespace filter" },
  { metric: "FOC sync (prototype)", value: "~120 ms", note: "Async, non-blocking" },
  { metric: "rebuild 1k memories", value: "~1.4 s", note: "From manifest + blobs" },
];

export const GRANT_RISKS = [
  {
    risk: "pynapse SDK API changes",
    mitigation: "Prototype backend preserves local dev; Synapse behind StorageBackend protocol",
  },
  {
    risk: "FVM gas for manifest flush",
    mitigation: "Periodic batching — never per-write anchoring",
  },
  {
    risk: "LangGraph BaseStore API evolution",
    mitigation: "Minimal surface; abatch compliance tests in CI",
  },
  {
    risk: "Adoption uncertainty",
    mitigation: "Narrow scope, PyPI + LangGraph tutorial, RFS-1 alignment",
  },
];
