import { ChartBar, Lightning } from "@phosphor-icons/react";
import { Panel, SectionHeading } from "../components/ui/Section";

type BenchmarkResults = Record<
  string,
  {
    local_write_ms: number;
    local_read_ms: number;
    foc_sync_ms: number | null;
    cid: string | null;
  }
>;

export function BenchmarkSection({
  benchmark,
  running,
  onRun,
}: {
  benchmark: BenchmarkResults | null;
  running: boolean;
  onRun: () => void;
}) {
  const rows = benchmark
    ? Object.entries(benchmark).map(([label, r]) => ({
        label: `Payload ${label}`,
        write: r.local_write_ms,
        read: r.local_read_ms,
        sync: r.foc_sync_ms,
        cid: r.cid,
      }))
    : [];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Performance"
        title="Hot path benchmarks"
        description="SQLite index keeps agent loops fast. FOC sync is async and does not block reads or writes."
        action={
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl border border-mem-gold/40 bg-mem-gold/10 px-4 py-2 text-sm font-medium text-mem-gold disabled:opacity-50"
          >
            <Lightning className="h-4 w-4" weight="duotone" />
            {running ? "Running…" : "Run benchmark"}
          </button>
        }
      />

      {rows.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center py-12 text-center">
            <ChartBar className="h-12 w-12 text-mem-muted" weight="duotone" />
            <p className="mt-4 text-sm text-mem-muted">
              Runs put/get at 1 KB, 10 KB, and 100 KB payload sizes against the live store.
            </p>
          </div>
        </Panel>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] rounded-2xl border border-mem-line bg-void-surface/90 text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-mem-muted">
              <tr className="border-b border-mem-line">
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Local write</th>
                <th className="px-6 py-4">Local read</th>
                <th className="px-6 py-4">FOC sync</th>
                <th className="px-6 py-4">CID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-mem-line/60">
                  <td className="px-6 py-4 font-medium text-mem-frost">{r.label}</td>
                  <td className="px-6 py-4 font-mono text-mem-gold">{r.write.toFixed(2)} ms</td>
                  <td className="px-6 py-4 font-mono">{r.read.toFixed(2)} ms</td>
                  <td className="px-6 py-4 font-mono">
                    {r.sync != null ? `${r.sync.toFixed(2)} ms` : "—"}
                  </td>
                  <td className="max-w-[180px] truncate px-6 py-4 font-mono text-[10px] text-mem-muted">
                    {r.cid ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Write target", value: "< 20 ms", detail: "SQLite put via abatch" },
          { label: "Read target", value: "< 5 ms", detail: "Exact get from index" },
          { label: "FOC sync", value: "Async", detail: "Never blocks agent loop" },
        ].map((m) => (
          <Panel key={m.label}>
            <p className="text-xs uppercase tracking-wider text-mem-muted">{m.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-mem-frost">{m.value}</p>
            <p className="mt-1 text-xs text-mem-muted">{m.detail}</p>
          </Panel>
        ))}
      </div>

      <Panel title="Why these numbers matter">
        <ul className="space-y-3 text-sm text-mem-muted">
          <li>
            LangGraph agents call <code className="text-mem-mint">store.put/get</code> inside tight
            loops — blocking on IPFS/FOC would break UX.
          </li>
          <li>
            MockFOC backend adds simulated upload latency; production Synapse is excluded from hot
            path.
          </li>
          <li>Manifest flush is periodic — not on every write.</li>
        </ul>
      </Panel>
    </div>
  );
}
