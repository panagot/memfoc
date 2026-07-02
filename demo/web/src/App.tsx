import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "./components/layout/AppHeader";
import { AppSidebar } from "./components/layout/AppSidebar";
import { LogoMark } from "./components/brand/LogoMark";
import { AssistantChat, AssistantFab } from "./components/chat/AssistantChat";
import type { SectionId } from "./data/navigation";
import { useMemfocData } from "./hooks/useMemfocData";
import { api } from "./lib/api";
import { AgentSection } from "./sections/AgentSection";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { BenchmarkSection } from "./sections/BenchmarkSection";
import { ConsoleSection } from "./sections/ConsoleSection";
import { DemoSection } from "./sections/DemoSection";
import { RoadmapSection } from "./sections/GrantSection";
import { IntegrationSection } from "./sections/IntegrationSection";
import { ManifestSection } from "./sections/ManifestSection";
import { OverviewSection } from "./sections/OverviewSection";
import { ProcessSection } from "./sections/ProcessSection";
import { UseCasesSection } from "./sections/UseCasesSection";

type ChatMessage = { role: "user" | "agent"; content: string };

export default function App() {
  const [section, setSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [benchmark, setBenchmark] = useState<Awaited<ReturnType<typeof api.benchmark>> | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { stats, memories, syncLog, events, loading, error, refresh } = useMemfocData();
  const apiOnline = !error;

  const navigate = useCallback((id: SectionId) => {
    setSection(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function runAction(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  async function seedDemo() {
    await api.putMemory(
      ["users", "demo-user", "preferences"],
      "theme",
      { value: "dark", source: "dashboard" },
    );
    await api.putMemory(
      ["agents", "memfoc-demo"],
      "capabilities",
      { storage: "filecoin", mode: "async-foc" },
    );
    await api.putMemory(
      ["users", "demo-user", "profile"],
      "timezone",
      { value: "UTC+2", source: "seed" },
    );
  }

  async function runAgent(input: string) {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    const res = await api.agentRun(text);
    setMessages((m) => [...m, { role: "agent", content: res.reply }]);
    await refresh();
  }

  function renderSection() {
    switch (section) {
      case "overview":
        return <OverviewSection stats={stats} onNavigate={navigate} />;
      case "use-cases":
        return <UseCasesSection onNavigate={navigate} />;
      case "integration":
        return <IntegrationSection />;
      case "architecture":
        return <ArchitectureSection />;
      case "process":
        return <ProcessSection />;
      case "demo":
        return <DemoSection onNavigate={navigate} />;
      case "console":
        return (
          <ConsoleSection
            memories={memories}
            syncLog={syncLog}
            events={events}
            stats={stats}
            loading={loading}
            onRefresh={refresh}
            onSeed={() => runAction("seed", seedDemo)}
          />
        );
      case "agent":
        return (
          <AgentSection
            messages={messages}
            running={busy === "agent"}
            onRun={(input) => runAction("agent", () => runAgent(input))}
          />
        );
      case "benchmarks":
        return (
          <BenchmarkSection
            benchmark={benchmark}
            running={busy === "benchmark"}
            onRun={() =>
              runAction("benchmark", async () => {
                setBenchmark(await api.benchmark());
              })
            }
          />
        );
      case "manifest":
        return (
          <ManifestSection
            manifest={stats?.latest_manifest ?? null}
            flushing={busy === "flush"}
            rebuilding={busy === "rebuild"}
            onFlush={() => runAction("flush", () => api.flushManifest().then(() => {}))}
            onRebuild={() => runAction("rebuild", () => api.rebuildIndex().then(() => {}))}
          />
        );
      case "roadmap":
        return <RoadmapSection />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-[100dvh] bg-void text-mem-frost">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-y-0 left-0 z-50 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-200`}
      >
        <AppSidebar active={section} onNavigate={navigate} apiOnline={apiOnline} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          active={section}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-rose-500/25 bg-rose-500/5 px-4 py-3 text-sm text-rose-200">
            <LogoMark size={18} className="opacity-60" />
            <span>
              API unreachable — run{" "}
              <code className="rounded bg-void-inset px-1.5 py-0.5 font-mono text-xs">
                python -m demo.server.main
              </code>
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div id="main-content" className="mx-auto max-w-4xl px-6 py-10 lg:max-w-5xl lg:px-10 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="shrink-0 border-t border-mem-line px-6 py-4 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-xs text-mem-muted">
            <span>MemFOC · Apache 2.0</span>
            <a
              href="https://filecoin.cloud/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-mem-frost"
            >
              Built for Filecoin Onchain Cloud
            </a>
          </div>
        </footer>
      </div>

      <AssistantFab active={assistantOpen} onClick={() => setAssistantOpen((o) => !o)} />
      <AssistantChat section={section} open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}
