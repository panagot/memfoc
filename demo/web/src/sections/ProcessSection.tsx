import { PROCESS_STEPS } from "../data/docs";
import { MemoryLifecycle } from "../components/graphics/MemoryLifecycle";
import { CodeBlock, MetricPill, Panel, SectionHeading } from "../components/ui/Section";

export function ProcessSection() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="End-to-end flow"
        title="Memory lifecycle"
        description="From agent write to verifiable FOC blob to periodic manifest anchor. Each step is observable in the Live Console."
      />

      <Panel>
        <MemoryLifecycle />
      </Panel>

      <div className="space-y-6">
        {PROCESS_STEPS.map((step) => (
          <Panel key={step.step}>
            <div className="grid gap-6 lg:grid-cols-[120px_1fr]">
              <div>
                <p className="font-mono text-4xl font-semibold text-mem-gold/40">{step.step}</p>
                <MetricPill label="Latency" value={step.latency} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-mem-frost">{step.title}</h3>
                <p className="mt-1 text-sm font-medium text-mem-mint">{step.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-mem-muted">{step.detail}</p>
                <div className="mt-4">
                  <CodeBlock code={step.code} />
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Consistency model">
        <ul className="space-y-3 text-sm text-mem-muted">
          <li>
            <span className="font-medium text-mem-frost">Read-your-writes:</span> always from SQLite —
            never blocked on FOC.
          </li>
          <li>
            <span className="font-medium text-mem-frost">Durability:</span> eventual — background worker
            with retry on failure.
          </li>
          <li>
            <span className="font-medium text-mem-frost">Verification:</span> manifest snapshot lists all
            CIDs; third parties can audit without trusting your server.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
