import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import type { SectionId } from "../data/navigation";
import { DEMO_WALKTHROUGH } from "../data/docs";
import { Bezel, BezelPanel, Eyebrow, PrimaryButton, SectionIntro } from "../components/ui/Bezel";

export function DemoSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const total = DEMO_WALKTHROUGH.length;

  return (
    <div className="space-y-16">
      {/* Progress bar */}
      <div data-demo-progress className="rounded-2xl border border-mem-line bg-void-inset p-4">
        <div className="mb-2 flex justify-between text-xs text-mem-muted">
          <span>Demo progress</span>
          <span>~3 min total · {total} steps</span>
        </div>
        <div className="flex gap-1">
          {DEMO_WALKTHROUGH.map((s) => (
            <div key={s.step} className="h-1 flex-1 overflow-hidden rounded-full bg-void">
              <div className="h-full w-full bg-mem-gold/50" />
            </div>
          ))}
        </div>
      </div>

      <SectionIntro
        eyebrow="Interactive demo"
        title="Five steps to see MemFOC work"
        description="Follow this walkthrough with the live API running. Each step links to the section where you perform the action."
      />

      <div className="relative">
        {/* Vertical connector */}
        <div className="absolute bottom-8 left-[27px] top-8 hidden w-px bg-mem-line md:block" />

        <div className="space-y-5">
          {DEMO_WALKTHROUGH.map((step) => (
            <Bezel key={step.step}>
              <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center">
                <div className="flex shrink-0 items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-mem-line bg-void-inset">
                    <span className="font-mono text-base font-medium text-mem-gold">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-mem-frost">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mem-muted">{step.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(step.section)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-mem-line px-4 py-2.5 text-sm font-medium text-mem-frost transition-colors hover:border-mem-gold/40 hover:text-mem-gold"
                >
                  {step.action}
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </button>
              </div>
            </Bezel>
          ))}
        </div>
      </div>

      <BezelPanel title="Prerequisites">
        <ul className="space-y-3">
          {[
            "Python venv with pip install -e \".[demo,dev]\"",
            "API running: python -m demo.server.main (port 8787)",
            "This dashboard connected (green dot in sidebar)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-mem-muted">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-mem-mint" weight="duotone" />
              {item}
            </li>
          ))}
        </ul>
      </BezelPanel>

      <div className="text-center">
        <Eyebrow>Ready?</Eyebrow>
        <p className="mt-4 text-mem-muted">Start with step 1 — seed demo data in the live console.</p>
        <PrimaryButton onClick={() => onNavigate("console")}>Open live console</PrimaryButton>
      </div>
    </div>
  );
}
