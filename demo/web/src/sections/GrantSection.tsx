import { CheckCircle, CircleDashed, Stack } from "@phosphor-icons/react";
import {
  BUILDING_NOW,
  COMPETITOR_MATRIX,
  PRODUCT_LAYERS,
  PRODUCT_MILESTONES,
} from "../data/docs";
import { Panel, SectionHeading } from "../components/ui/Section";

const SHIPPED = BUILDING_NOW.filter((b) => b.status === "done");
const PLANNED = BUILDING_NOW.filter((b) => b.status === "planned");

export function RoadmapSection() {
  return (
    <div className="space-y-10 md:space-y-14">
      <SectionHeading
        eyebrow="Product"
        title="What ships today"
        description="MemFOC is open source. This demo runs the local development stack; production uses Synapse on Filecoin Onchain Cloud."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Available now" subtitle="In this repository and demo">
          <ul className="space-y-3">
            {SHIPPED.map((item) => (
              <li key={item.item} className="flex gap-3 text-sm">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-mem-mint" weight="fill" />
                <div>
                  <p className="font-medium text-mem-frost">{item.item}</p>
                  <p className="text-xs text-mem-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Coming next" subtitle="On the public roadmap">
          <ul className="space-y-3">
            {PLANNED.map((item) => (
              <li key={item.item} className="flex gap-3 text-sm">
                <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-mem-gold" weight="duotone" />
                <div>
                  <p className="font-medium text-mem-frost">{item.item}</p>
                  <p className="text-xs text-mem-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <SectionHeading
        title="Release phases"
        description="Incremental path to pip install memfoc on mainnet Filecoin Onchain Cloud."
      />
      <div className="space-y-4">
        {PRODUCT_MILESTONES.map((m) => (
          <Panel key={m.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-mem-frost">
                {m.id}: {m.title}
              </h3>
              <span className="font-mono text-sm text-mem-gold">{m.timeline}</span>
            </div>
            <p className="mt-2 text-sm text-mem-muted">{m.description}</p>
            <ul className="mt-4 space-y-2">
              {m.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-mem-muted">
                  <Stack className="mt-0.5 h-4 w-4 shrink-0 text-mem-gold" weight="duotone" />
                  {d}
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <SectionHeading
        title="Ecosystem positioning"
        description="MemFOC is the narrow LangGraph storage adapter — not a hosted memory platform."
      />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-mem-muted">
              <tr className="border-b border-mem-line">
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3">Layer</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_LAYERS.map((row) => (
                <tr key={row.product} className="border-b border-mem-line/60">
                  <td className="py-3 pr-4 font-medium text-mem-frost">{row.product}</td>
                  <td className="py-3 text-mem-muted">{row.layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <SectionHeading title="Comparison" />
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-mem-muted">
              <tr className="border-b border-mem-line">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">BaseStore</th>
                <th className="pb-3 pr-4">Decentralized</th>
                <th className="pb-3 pr-4">Layer</th>
                <th className="pb-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_MATRIX.map((row) => (
                <tr key={row.name} className="border-b border-mem-line/60">
                  <td className="py-3 pr-4 font-medium text-mem-frost">{row.name}</td>
                  <td className="py-3 pr-4">{row.basestore ? "✓" : "—"}</td>
                  <td className="py-3 pr-4">{row.decentralized ? "✓" : "—"}</td>
                  <td className="py-3 pr-4 text-mem-muted">{row.layer}</td>
                  <td className="py-3 text-mem-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
