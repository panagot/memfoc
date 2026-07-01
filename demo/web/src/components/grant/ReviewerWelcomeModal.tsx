import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, GithubLogo, PlayCircle, X } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";

const STORAGE_KEY = "memfoc-reviewer-welcome-v1";

const STEPS: { section: SectionId; label: string; time: string }[] = [
  { section: "overview", label: "Overview", time: "45s" },
  { section: "demo", label: "Guided demo", time: "30s" },
  { section: "console", label: "Live console", time: "90s" },
  { section: "grant", label: "Grant roadmap", time: "60s" },
];

export function ReviewerWelcomeModal({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(false);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            className="max-w-lg rounded-3xl border border-mem-gold/30 bg-void-surface p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-mem-gold">
                  For FIL Builder reviewers
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-mem-frost">
                  4-minute evaluation path
                </h2>
                <p className="mt-2 text-sm text-mem-muted">
                  Prototype mode: MockFOCBackend, simulated FVM, ephemeral Vercel storage.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg p-1.5 text-mem-muted hover:text-mem-frost"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="mt-6 space-y-2">
              {STEPS.map((s, i) => (
                <li key={s.section}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(s.section);
                      dismiss();
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-mem-line bg-void-inset px-4 py-3 text-left text-sm transition hover:border-mem-gold/30"
                  >
                    <span>
                      <span className="font-mono text-xs text-mem-gold">{i + 1}.</span>{" "}
                      {s.label}
                    </span>
                    <span className="text-xs text-mem-muted">{s.time}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://github.com/panagot/memfoc"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-mem-line px-4 py-2 text-xs font-medium text-mem-frost hover:border-mem-gold/30"
              >
                <GithubLogo className="h-4 w-4" weight="duotone" />
                Clone repo
              </a>
              <button
                type="button"
                onClick={() => {
                  onNavigate("demo");
                  dismiss();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-mem-gold px-4 py-2 text-xs font-semibold text-void"
              >
                <PlayCircle className="h-4 w-4" weight="fill" />
                Start guided demo
              </button>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 flex w-full items-center justify-center gap-1 text-xs text-mem-muted hover:text-mem-frost"
            >
              Skip — I know the project
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
