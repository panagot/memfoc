import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { LogoMark } from "./components/brand/LogoMark";
import { AssistantChat, AssistantFab } from "./components/chat/AssistantChat";
import { GrantOptimizer, GrantOptimizerFab } from "./components/chat/GrantOptimizer";
import { JudgeTourBanner, GrantPitchStrip } from "./components/grant/JudgeTourBanner";
import { PrototypeBanner } from "./components/grant/PrototypeBanner";
import { useGrantPolish } from "./hooks/GrantPolishContext";
import { getSection } from "./data/navigation";
import type { SectionId } from "./data/navigation";
import { useMemfocData } from "./hooks/useMemfocData";
import { api } from "./lib/api";
import { ReviewerWelcomeModal } from "./components/grant/ReviewerWelcomeModal";
import { AgentSection } from "./sections/AgentSection";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { BenchmarkSection } from "./sections/BenchmarkSection";
import { ConsoleSection } from "./sections/ConsoleSection";
import { DemoSection } from "./sections/DemoSection";
import { FundingGapSection } from "./sections/FundingGapSection";
import { GrantSection } from "./sections/GrantSection";
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
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [benchmark, setBenchmark] = useState<Awaited<ReturnType<typeof api.benchmark>> | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { judgeMode } = useGrantPolish();
  const { stats, memories, syncLog, events, loading, error, refresh } = useMemfocData();
  const apiOnline = !error;
  const current = getSection(section);

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
      case "funding-gap":
        return <FundingGapSection onNavigate={navigate} />;
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
      case "grant":
        return <GrantSection />;
      default:
        return null;
    }
  }

  return (
    <div className={clsx("mesh-bg flex min-h-[100dvh] bg-void text-mem-frost", judgeMode && "grant-judge-mode")}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-500 ease-spring lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          active={section}
          onNavigate={navigate}
          apiOnline={apiOnline}
          mobileMode={sidebarOpen}
        />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar
          active={section}
          onNavigate={navigate}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        {error && (
          <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-200/90 md:mx-6">
            <LogoMark size={20} className="opacity-50" />
            <span>
              API unreachable — run{" "}
              <code className="rounded bg-void-inset px-1.5 py-0.5 font-mono text-xs">
                python -m demo.server.main
              </code>
            </span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
            <PrototypeBanner />
            <JudgeTourBanner onNavigate={navigate} />
            {(judgeMode || section === "overview") && <GrantPitchStrip />}

            {current && (
              <header className="mb-8 md:mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mem-gold/80">
                  {current.group === "Primary" ? "Main" : current.group}
                </p>
                <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-mem-frost md:text-3xl">
                  {current.label}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-mem-muted md:text-base">
                  {current.description}
                </p>
              </header>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <footer className="border-t border-mem-line px-4 py-5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-mem-muted">
              <LogoMark size={16} />
              <span>MemFOC · LangGraph BaseStore on Filecoin · FIL Builder Next Step</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a
                href="https://github.com/panagot/memfoc"
                target="_blank"
                rel="noreferrer"
                className="text-mem-muted hover:text-mem-gold"
              >
                GitHub ↗
              </a>
              <a
                href="https://memfoc-one.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="text-mem-muted hover:text-mem-gold"
              >
                Live demo ↗
              </a>
              <a
                href="https://github.com/panagot/memfoc/blob/main/docs/GRANT.md"
                target="_blank"
                rel="noreferrer"
                className="text-mem-muted hover:text-mem-gold"
              >
                GRANT.md ↗
              </a>
              <a
                href="https://github.com/panagot/memfoc/blob/main/docs/COST_MODEL.md"
                target="_blank"
                rel="noreferrer"
                className="text-mem-muted hover:text-mem-gold"
              >
                Cost model ↗
              </a>
            </div>
            <p className="text-[10px] text-mem-muted/80">Best experienced on desktop · 1280px+</p>
          </div>
        </footer>
      </div>

      <ReviewerWelcomeModal onNavigate={navigate} />
      <GrantOptimizerFab
        active={optimizerOpen}
        onClick={() => {
          setOptimizerOpen((o) => !o);
          if (!optimizerOpen) setAssistantOpen(false);
        }}
      />
      <AssistantFab
        active={assistantOpen}
        onClick={() => {
          setAssistantOpen((o) => !o);
          if (!assistantOpen) setOptimizerOpen(false);
        }}
      />
      <GrantOptimizer
        section={section}
        open={optimizerOpen}
        onClose={() => setOptimizerOpen(false)}
        apiOnline={apiOnline}
        onNavigate={navigate}
      />
      <AssistantChat section={section} open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  );
}

