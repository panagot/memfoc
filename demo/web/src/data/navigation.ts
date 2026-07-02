import {
  ChartLineUp,
  CloudArrowUp,
  GitBranch,
  GitDiff,
  House,
  Lightbulb,
  PlayCircle,
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
  | "roadmap"
  | "integration";

export type NavItem = {
  id: SectionId;
  label: string;
  description: string;
  icon: typeof House;
  group: "Product" | "Deep dive" | "Operations";
};

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Product",
    items: [
      {
        id: "overview",
        label: "Overview",
        description: "What MemFOC is and why it matters",
        icon: House,
        group: "Product",
      },
      {
        id: "architecture",
        label: "Architecture",
        description: "SQLite, FOC, and FVM layers",
        icon: SquaresFour,
        group: "Product",
      },
      {
        id: "demo",
        label: "Guided demo",
        description: "Step-by-step walkthrough",
        icon: PlayCircle,
        group: "Product",
      },
      {
        id: "console",
        label: "Live console",
        description: "Memory index and sync feed",
        icon: TerminalWindow,
        group: "Product",
      },
      {
        id: "roadmap",
        label: "Roadmap",
        description: "Shipped features and upcoming releases",
        icon: Scroll,
        group: "Product",
      },
    ],
  },
  {
    label: "Deep dive",
    items: [
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
    ],
  },
  {
    label: "Operations",
    items: [
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
    ],
  },
];

/** @deprecated use NAV_GROUPS */
export const PRIMARY_NAV = NAV_GROUPS[0].items;
/** @deprecated use NAV_GROUPS */
export const SIDEBAR_NAV = [...NAV_GROUPS[1].items, ...NAV_GROUPS[2].items];

export const ALL_SECTIONS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function getSection(id: SectionId): NavItem | undefined {
  return ALL_SECTIONS.find((n) => n.id === id);
}

export const QUICK_LINKS = [
  { label: "GitHub", href: "https://github.com/panagot/memfoc" },
  { label: "Documentation", href: "https://github.com/panagot/memfoc#quick-start" },
  { label: "Filecoin Onchain Cloud", href: "https://filecoin.cloud/" },
  { label: "LangGraph Stores", href: "https://docs.langchain.com/oss/python/langgraph/stores" },
];
