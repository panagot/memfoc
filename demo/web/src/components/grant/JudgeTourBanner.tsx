import clsx from "clsx";
import { ArrowRight, X } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { useGrantPolish } from "../../hooks/GrantPolishContext";

const JUDGE_STEPS: { section: SectionId; label: string; time: string }[] = [
  { section: "overview", label: "Overview", time: "45s" },
  { section: "demo", label: "Guided demo", time: "30s" },
  { section: "console", label: "Live console", time: "90s" },
  { section: "grant", label: "Grant roadmap", time: "60s" },
];

export function JudgeTourBanner({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const { tourDismissed, dismissTour, judgeMode } = useGrantPolish();

  if (tourDismissed && !judgeMode) return null;

  return (
    <div
      data-grant-tour
      className="mx-4 mb-4 rounded-2xl border border-mem-gold/25 bg-gradient-to-r from-mem-gold/[0.08] to-mem-mint/[0.05] p-4 md:mx-0 md:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mem-gold">
            {judgeMode ? "Judge mode active" : "Reviewer fast path · ~4 min"}
          </p>
          <p className="mt-1 text-sm text-mem-muted">
            FIL Builder reviewers: follow this sequence to see live code, sync, and grant milestones.
          </p>
        </div>
        <button
          type="button"
          onClick={dismissTour}
          className="rounded-lg p-1.5 text-mem-muted hover:text-mem-frost"
          aria-label="Dismiss tour"
        >
          <X className="h-4 w-4" weight="light" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {JUDGE_STEPS.map((s, i) => (
          <button
            key={s.section}
            type="button"
            onClick={() => onNavigate(s.section)}
            className="group inline-flex items-center gap-2 rounded-full border border-mem-line bg-void-inset/80 px-3 py-1.5 text-xs font-medium text-mem-muted transition hover:border-mem-gold/30 hover:text-mem-gold"
          >
            <span className="font-mono text-[10px] text-mem-gold/70">{String(i + 1)}</span>
            {s.label}
            <span className="text-[10px] opacity-60">{s.time}</span>
            <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" weight="bold" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function GrantPitchStrip() {
  const { judgeMode } = useGrantPolish();
  return (
    <div
      className={clsx(
        "mb-6 flex flex-wrap items-center gap-2 rounded-2xl border px-4 py-3 text-xs md:text-sm",
        judgeMode
          ? "border-mem-gold/40 bg-mem-gold/[0.08] shadow-glow"
          : "border-mem-line bg-void-inset/60",
      )}
    >
      <span className="font-display font-bold text-mem-gold">MemFOC</span>
      <span className="text-mem-muted">·</span>
      <span className="text-mem-frost">
        PostgresStore semantics on verifiable Filecoin storage
      </span>
      <span className="hidden text-mem-muted md:inline">·</span>
      <span className="hidden font-mono text-[11px] text-mem-mint md:inline">
        graph.compile(store=FilecoinStore())
      </span>
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { label: "RFS-1 aligned", sub: "Agent memory gap" },
    { label: "Native BaseStore", sub: "LangGraph drop-in" },
    { label: "FVM manifest", sub: "Periodic anchoring" },
    { label: "Open source", sub: "PyPI deliverable" },
  ];
  return (
    <div data-grant-trust className="mt-8 flex flex-wrap gap-2">
      {badges.map((b) => (
        <div
          key={b.label}
          className="rounded-2xl border border-mem-gold/20 bg-mem-gold/[0.05] px-3 py-2"
        >
          <p className="text-[11px] font-bold text-mem-gold">{b.label}</p>
          <p className="text-[10px] text-mem-muted">{b.sub}</p>
        </div>
      ))}
    </div>
  );
}
