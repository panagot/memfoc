import { CheckCircle, CurrencyCircleDollar, GitBranch } from "@phosphor-icons/react";
import { GRANT_MILESTONES, COMPETITOR_MATRIX } from "../data/docs";
import { BudgetBar, RfsAlignmentCallout, WhyFundSection } from "../components/grant/GrantBlocks";
import { Panel, SectionHeading } from "../components/ui/Section";

export function GrantSection() {
  return (
    <div className="space-y-10 md:space-y-14">
      <div className="grid gap-4 md:grid-cols-3">
        <Panel>
          <CurrencyCircleDollar className="h-8 w-8 text-mem-gold" weight="duotone" />
          <p className="mt-4 text-xs uppercase tracking-wider text-mem-muted">Ask</p>
          <p className="mt-1 text-2xl font-semibold text-mem-frost">$7,000</p>
          <p className="mt-1 text-xs text-mem-muted">FIL Builder Next Step</p>
        </Panel>
        <Panel>
          <GitBranch className="h-8 w-8 text-mem-gold" weight="duotone" />
          <p className="mt-4 text-xs uppercase tracking-wider text-mem-muted">Timeline</p>
          <p className="mt-1 text-2xl font-semibold text-mem-frost">10 weeks</p>
          <p className="mt-1 text-xs text-mem-muted">Jul – Oct 2026</p>
        </Panel>
        <Panel>
          <CheckCircle className="h-8 w-8 text-mem-gold" weight="duotone" />
          <p className="mt-4 text-xs uppercase tracking-wider text-mem-muted">Deliverable</p>
          <p className="mt-1 text-lg font-semibold text-mem-frost">pip install memfoc</p>
          <p className="mt-1 text-xs text-mem-muted">+ mainnet FOC + FVM</p>
        </Panel>
      </div>

      <Panel title="Budget breakdown" subtitle="$7,000 total · milestone-gated">
        <BudgetBar />
      </Panel>

      <WhyFundSection />
      <RfsAlignmentCallout />

      <SectionHeading title="Milestones" description="Each milestone ships verifiable code — not documentation-only." />
      <div className="space-y-4">
        {GRANT_MILESTONES.map((m) => (
          <Panel key={m.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-mem-frost">
                {m.id}: {m.title}
              </h3>
              <span className="font-mono text-sm text-mem-gold">{m.weeks}</span>
            </div>
            <p className="mt-2 text-sm text-mem-muted">{m.description}</p>
            <ul className="mt-4 space-y-2">
              {m.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-mem-muted">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-mem-gold" weight="duotone" />
                  {d}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <SectionHeading title="Competitive positioning" />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-mem-muted">
              <tr className="border-b border-mem-line">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">BaseStore</th>
                <th className="pb-3 pr-4">Decentralized</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_MATRIX.map((row) => (
                <tr key={row.name} className="border-b border-mem-line/60">
                  <td className="py-3 pr-4 font-medium text-mem-frost">{row.name}</td>
                  <td className="py-3 pr-4">{row.basestore ? "✓" : "—"}</td>
                  <td className="py-3 pr-4">{row.decentralized ? "✓" : "—"}</td>
                  <td className="py-3 text-mem-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="One-line pitch">
        <p className="text-lg leading-relaxed text-mem-frost">
          MemFOC is{" "}
          <span className="text-mem-gold">PostgresStore, but durable and verifiable on Filecoin</span>{" "}
          — a native LangGraph BaseStore adapter aligned with Filecoin RFS-1 agent memory requirements.
        </p>
      </Panel>
    </div>
  );
}
