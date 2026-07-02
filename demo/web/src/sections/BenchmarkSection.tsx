import { ChartBar, Lightning } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { TYPICAL_BENCHMARKS } from "../data/docs";
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

const TARGET_MS = 20;

function LatencyBars({ rows }: { rows: { label: string; write: number; read: number }[] }) {
  const max = Math.max(TARGET_MS * 1.5, ...rows.flatMap((r) => [r.write, r.read]), 1);
  return (
    <Panel title="Latency vs 20ms target" subtitle="Local write + read (hot path)">
      <div className="space-y-5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-medium text-mem-frost">{r.label}</span>
              <span className="font-mono text-mem-muted">
                W {r.write.toFixed(1)}ms · R {r.read.toFixed(1)}ms
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-void-inset">
              <div
                className="absolute top-0 bottom-0 w-px bg-rose-400/70"
                style={{ left: `${(TARGET_MS / max) * 100}%` }}
                title="20ms target"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (r.write / max) * 100)}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-mem-gold/80"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (r.read / max) * 100)}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="absolute inset-y-1 left-0 rounded-full bg-mem-mint/70"
                style={{ maxWidth: `${(r.read / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-mem-muted">
          Gold = write · Mint = read · Red line = 20ms agent-loop target
        </p>
      </div>
    </Panel>
  );
}

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
        <>
          <Panel title="Typical local numbers" subtitle="From dev runs — click Run benchmark for live measurements">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-mem-muted">
                  <tr className="border-b border-mem-line">
                    <th className="pb-3 pr-4">Metric</th>
                    <th className="pb-3 pr-4">Typical</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPICAL_BENCHMARKS.map((row) => (
                    <tr key={row.metric} className="border-b border-mem-line/60">
                      <td className="py-3 pr-4 font-medium text-mem-frost">{row.metric}</td>
                      <td className="py-3 pr-4 font-mono text-mem-gold">{row.value}</td>
                      <td className="py-3 text-mem-muted">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-mem-muted">
              Hot path vs InMemoryStore: comparable read/write latency. FOC sync is async and excluded
              from agent loop blocking.
            </p>
          </Panel>
          <Panel>
            <div className="flex flex-col items-center py-8 text-center">
              <ChartBar className="h-12 w-12 text-mem-muted" weight="duotone" />
              <p className="mt-4 text-sm text-mem-muted">
                Run live put/get at 1 KB, 10 KB, and 100 KB against the connected store.
              </p>
            </div>
          </Panel>
        </>
      ) : (
        <>
          <LatencyBars rows={rows.map(({ label, write, read }) => ({ label, write, read }))} />
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
        </>
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
            Local dev backend adds upload latency off the hot path; production Synapse is excluded from hot
            path.
          </li>
          <li>Manifest flush is periodic — not on every write.</li>
        </ul>
      </Panel>
    </div>
  );
}
