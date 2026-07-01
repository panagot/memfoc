import clsx from "clsx";
import { useState } from "react";
import html2canvas from "html2canvas";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  CheckCircle,
  Lightning,
  Robot,
  Scan,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { useGrantPolish } from "../../hooks/GrantPolishContext";
import { auditDom } from "../../lib/domAudit";
import { api } from "../../lib/api";

type ReviewResult = Awaited<ReturnType<typeof api.designReview>>;
type FullAudit = Awaited<ReturnType<typeof api.grantFullAudit>>;

const SEV: Record<string, string> = {
  high: "border-rose-500/30 bg-rose-500/[0.06] text-rose-200",
  medium: "border-mem-gold/30 bg-mem-gold/[0.06] text-mem-gold",
  low: "border-mem-line bg-void-inset text-mem-muted",
  info: "border-mem-mint/25 bg-mem-mint/[0.05] text-mem-mint",
};

export function GrantOptimizer({
  section,
  open,
  onClose,
  apiOnline,
  onNavigate,
}: {
  section: SectionId;
  open: boolean;
  onClose: () => void;
  apiOnline: boolean;
  onNavigate: (id: SectionId) => void;
}) {
  const { judgeMode, enableJudgeMode, disableJudgeMode } = useGrantPolish();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [fullAudit, setFullAudit] = useState<FullAudit | null>(null);
  const [phase, setPhase] = useState<"idle" | "analyzed" | "optimized">("idle");

  async function captureAndAnalyze(polishActive = false) {
    setBusy(true);
    try {
      const el = document.getElementById("main-content");
      let screenshot_b64: string | undefined;
      if (el) {
        const canvas = await html2canvas(el, {
          backgroundColor: "#020306",
          scale: window.devicePixelRatio > 1 ? 1.5 : 1,
          logging: false,
          useCORS: true,
        });
        setPreview(canvas.toDataURL("image/jpeg", 0.82));
        screenshot_b64 = canvas.toDataURL("image/jpeg", 0.65).split(",")[1];
      }
      const dom = auditDom(section);
      const review = await api.designReview({
        section,
        viewport_w: window.innerWidth,
        viewport_h: window.innerHeight,
        screenshot_b64,
        api_online: apiOnline,
        dom,
        polish_active: polishActive,
      });
      setResult(review);
      setPhase(polishActive ? "optimized" : "analyzed");
      return review;
    } catch {
      setResult({
        agent: "grant-optimizer",
        section,
        score: 0,
        summary: "API offline — start python -m demo.server.main",
        suggestions: [
          { severity: "high", title: "Backend required", detail: "Grant Optimizer needs the demo API on :8787." },
        ],
      });
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function runFullAudit() {
    setBusy(true);
    try {
      const audit = await api.grantFullAudit(apiOnline);
      setFullAudit(audit);
    } finally {
      setBusy(false);
    }
  }

  async function applyOptimizations() {
    const review = await captureAndAnalyze(true);
    if (review?.applicable_fixes) {
      enableJudgeMode(review.applicable_fixes.map((f) => f.id));
    } else {
      enableJudgeMode(["judge_tour", "grant_pitch_strip", "emphasis_glow"]);
    }
  }

  function reset() {
    disableJudgeMode();
    setPhase("idle");
    setResult(null);
    setPreview(null);
    setFullAudit(null);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-24 right-[5.5rem] z-[60] flex w-[min(100vw-2.5rem,440px)] max-h-[min(88vh,620px)] flex-col overflow-hidden rounded-3xl border border-mem-mint/25 bg-void-raised/98 shadow-glow-mint backdrop-blur-xl"
        >
          <header className="flex items-center justify-between border-b border-mem-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-mem-mint/10 p-2 ring-1 ring-mem-mint/25">
                <Robot className="h-5 w-5 text-mem-mint" weight="duotone" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-mem-frost">Grant Optimizer</p>
                <p className="text-[10px] text-mem-muted">Independent agent · screenshot · auto-fix</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-mem-muted hover:text-mem-frost">
              <X className="h-4 w-4" weight="light" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {phase === "idle" && !preview && (
              <div className="space-y-3 text-sm text-mem-muted">
                <p>
                  Autonomous agent for FIL Builder reviewers. Captures this page, scores grant appeal
                  on a 6-point rubric, and applies UI optimizations.
                </p>
                <ol className="list-decimal space-y-1 pl-4 text-xs">
                  <li>Screenshot + DOM audit</li>
                  <li>Grant rubric scoring</li>
                  <li>One-click apply improvements</li>
                </ol>
              </div>
            )}

            {preview && (
              <div className="mb-4 overflow-hidden rounded-2xl border border-mem-line">
                <img src={preview} alt="Captured viewport" className="h-auto w-full" />
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-mem-line bg-void-inset px-4 py-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-mem-muted">Grant appeal</p>
                    <p className="font-mono text-3xl font-bold text-mem-mint">
                      {result.score}
                      <span className="text-lg text-mem-muted">/100</span>
                    </p>
                    {result.score_before != null && result.score > result.score_before && (
                      <p className="text-[10px] text-mem-gold">
                        +{result.score - result.score_before} after optimizations
                      </p>
                    )}
                  </div>
                  {judgeMode && (
                    <span className="rounded-full border border-mem-gold/30 bg-mem-gold/10 px-2 py-1 text-[10px] font-bold text-mem-gold">
                      JUDGE MODE
                    </span>
                  )}
                </div>

                {result.rubric && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-mem-muted">Rubric</p>
                    {result.rubric.map((r) => (
                      <div key={r.id} className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-void-inset">
                          <div
                            className="h-full rounded-full bg-mem-mint transition-all duration-700"
                            style={{ width: `${(r.score / r.weight) * 100}%` }}
                          />
                        </div>
                        <span className="w-24 shrink-0 text-mem-muted">{r.label}</span>
                        <span className="font-mono text-mem-frost">{r.score}/{r.weight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.applied_fixes && result.applied_fixes.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-mem-mint">
                      Applied improvements
                    </p>
                    <ul className="space-y-1.5">
                      {result.applied_fixes.map((f) => (
                        <li
                          key={f.id}
                          className="flex items-start gap-2 rounded-xl border border-mem-mint/20 bg-mem-mint/[0.04] px-3 py-2 text-xs"
                        >
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mem-mint" weight="fill" />
                          <span>
                            <strong className="text-mem-frost">{f.title}</strong> — {f.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className={clsx("rounded-xl border px-3 py-2 text-xs leading-relaxed", SEV[s.severity] ?? SEV.info)}
                    >
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 opacity-90">{s.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {fullAudit && (
              <div className="mt-4 rounded-2xl border border-mem-gold/20 bg-mem-gold/[0.04] p-3">
                <p className="text-xs font-bold text-mem-gold">{fullAudit.headline}</p>
                <p className="mt-1 font-mono text-2xl text-mem-frost">{fullAudit.overall_readiness}% ready</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-mem-muted">Judge path</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {fullAudit.priorities.map((p) => (
                    <button
                      key={p.section}
                      type="button"
                      onClick={() => onNavigate(p.section as SectionId)}
                      className="rounded-full border border-mem-line px-2 py-0.5 text-[10px] text-mem-muted hover:text-mem-gold"
                    >
                      {p.priority}. {p.section}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-mem-line p-3">
            {phase === "optimized" ? (
              <button
                type="button"
                onClick={reset}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-mem-line py-2.5 text-sm text-mem-muted"
              >
                Reset judge mode
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => captureAndAnalyze(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-mem-mint/15 py-3 text-sm font-bold text-mem-mint ring-1 ring-mem-mint/30 disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" weight="duotone" />
                  {busy ? "Scanning…" : "Capture & score page"}
                </button>
                {result?.can_apply && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={applyOptimizations}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-mem-gold to-mem-gold-dim py-3 text-sm font-bold text-void disabled:opacity-50"
                  >
                    <Lightning className="h-4 w-4" weight="fill" />
                    Apply grant optimizations
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={runFullAudit}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-mem-line py-2.5 text-xs text-mem-muted hover:text-mem-frost"
                >
                  <Scan className="h-3.5 w-3.5" />
                  Full site readiness audit
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GrantOptimizerFab({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={clsx(
        "fixed bottom-5 right-[5.5rem] z-[55] flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500",
        active
          ? "bg-void-inset ring-2 ring-mem-mint/40"
          : "bg-void-surface ring-1 ring-mem-mint/30 shadow-glow-mint hover:ring-mem-mint/50",
      )}
      aria-label="Grant Optimizer agent"
      title="Grant Optimizer — screenshot & auto-improve"
    >
      {active ? (
        <X className="h-6 w-6 text-mem-mint" weight="light" />
      ) : (
        <>
          <Sparkle className="h-6 w-6 text-mem-mint" weight="duotone" />
          <span className="absolute -left-1 -top-1 rounded-full bg-mem-gold px-1.5 py-0.5 text-[8px] font-bold text-void">
            AI
          </span>
        </>
      )}
    </motion.button>
  );
}
