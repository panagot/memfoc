import {
  ChartLineUp,
  CloudArrowUp,
  GitBranch,
  GitDiff,
  House,
  Lightbulb,
  PlayCircle,
  Rocket,
  Robot,
  Scroll,
  SquaresFour,
  TerminalWindow,
} from "@phosphor-icons/react";

export type SectionId =
  | "overview"
  | "use-cases"
  | "architecture"
  | "process"
  | "demo"
  | "console"
  | "agent"
  | "benchmarks"
  | "manifest"
  | "grant"
  | "funding-gap"
  | "integration";

export type NavItem = {
  id: SectionId;
  label: string;
  description: string;
  icon: typeof House;
  group: "Primary" | "Deep dive" | "Operations";
};

/** Top navigation — main grant-demo journey */
export const PRIMARY_NAV: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    description: "What MemFOC is and why it matters",
    icon: House,
    group: "Primary",
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "SQLite, FOC, and FVM layers",
    icon: SquaresFour,
    group: "Primary",
  },
  {
    id: "demo",
    label: "Guided demo",
    description: "Step-by-step walkthrough",
    icon: PlayCircle,
    group: "Primary",
  },
  {
    id: "console",
    label: "Live console",
    description: "Memory index and sync feed",
    icon: TerminalWindow,
    group: "Primary",
  },
  {
    id: "grant",
    label: "Grant roadmap",
    description: "FIL Builder Next Step plan",
    icon: Scroll,
    group: "Primary",
  },
];

/** Left sidebar — secondary pages only (no overlap with top nav) */
export const SIDEBAR_NAV: NavItem[] = [
  {
    id: "funding-gap",
    label: "Today → Funded",
    description: "Prototype vs grant deliverables",
    icon: Rocket,
    group: "Deep dive",
  },
  {
    id: "integration",
    label: "Integration",
    description: "PostgresStore vs FilecoinStore",
    icon: GitDiff,
    group: "Deep dive",
  },
  {
    id: "use-cases",
    label: "Use cases",
    description: "Who needs verifiable agent memory",
    icon: Lightbulb,
    group: "Deep dive",
  },
  {
    id: "process",
    label: "How it works",
    description: "Write → sync → anchor → recover",
    icon: GitBranch,
    group: "Deep dive",
  },
  {
    id: "agent",
    label: "Agent playground",
    description: "LangGraph memory in action",
    icon: Robot,
    group: "Operations",
  },
  {
    id: "benchmarks",
    label: "Benchmarks",
    description: "Hot-path latency measurements",
    icon: ChartLineUp,
    group: "Operations",
  },
  {
    id: "manifest",
    label: "Manifest & recovery",
    description: "On-chain snapshots and rebuild",
    icon: CloudArrowUp,
    group: "Operations",
  },
];

/** All sections for lookups */
export const ALL_SECTIONS: NavItem[] = [...PRIMARY_NAV, ...SIDEBAR_NAV];

export function getSection(id: SectionId): NavItem | undefined {
  return ALL_SECTIONS.find((n) => n.id === id);
}

export const QUICK_LINKS = [
  { label: "Filecoin Onchain Cloud", href: "https://filecoin.cloud/" },
  { label: "LangGraph Stores", href: "https://docs.langchain.com/oss/python/langgraph/stores" },
  { label: "FIL Builder Grants", href: "https://github.com/filecoin-project/devgrants" },
  { label: "Filecoin RFS-1", href: "https://filecoin.cloud/agents/rfs-1" },
];

export const JUDGE_HIGHLIGHTS = [
  { label: "Native BaseStore", detail: "graph.compile(store=FilecoinStore())" },
  { label: "FVM required", detail: "MemoryManifest.sol anchoring" },
  { label: "Open source", detail: "PyPI + GitHub grant deliverable" },
  { label: "RFS-1 aligned", detail: "Decentralized Mem0 alternative" },
];
