import { ArrowRight, CheckCircle, CircleDashed, Rocket } from "@phosphor-icons/react";
import { BUILDING_NOW } from "../data/docs";
import { Panel, SectionHeading } from "../components/ui/Section";
import type { SectionId } from "../data/navigation";

const TODAY = BUILDING_NOW.filter((b) => b.status === "done");
const FUNDED = BUILDING_NOW.filter((b) => b.status === "grant");

export function FundingGapSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Grant scope"
        title="Today → After funding"
        description="The prototype proves architecture end-to-end locally. Grant dollars ship production Filecoin backends — not a greenfield rewrite."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Today (prototype)" subtitle="Working in repo + live demo">
          <ul className="space-y-3">
            {TODAY.map((item) => (
              <li key={item.item} className="flex gap-3 text-sm">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-mem-mint" weight="fill" />
                <div>
                  <p className="font-medium text-mem-frost">{item.item}</p>
                  <p className="text-xs text-mem-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-mem-gold/20 bg-mem-gold/5 px-3 py-2 text-xs text-mem-muted">
            MockFOCBackend · simulated FVM tx · Vercel data may reset on cold start
          </p>
        </Panel>

        <Panel title="After grant ($7K)" subtitle="M2–M4 deliverables">
          <ul className="space-y-3">
            {FUNDED.map((item) => (
              <li key={item.item} className="flex gap-3 text-sm">
                <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-mem-gold" weight="duotone" />
                <div>
                  <p className="font-medium text-mem-frost">{item.item}</p>
                  <p className="text-xs text-mem-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onNavigate("grant")}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-mem-gold hover:underline"
          >
            View milestone breakdown
            <ArrowRight className="h-4 w-4" weight="bold" />
          </button>
        </Panel>
      </div>

      <Panel title="Why fund the remaining 60%?">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Rocket,
              title: "Architecture proven",
              body: "Write → SQLite → async FOC → manifest → rebuild works today with mocks.",
            },
            {
              icon: CheckCircle,
              title: "Risk is integration",
              body: "Synapse + FVM replace transport layers — not the BaseStore design.",
            },
            {
              icon: ArrowRight,
              title: "Clear exit",
              body: "pip install memfoc on mainnet FOC with on-chain verification.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-mem-line bg-void-inset p-4">
              <Icon className="h-7 w-7 text-mem-gold" weight="duotone" />
              <p className="mt-3 font-semibold text-mem-frost">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-mem-muted">{body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
