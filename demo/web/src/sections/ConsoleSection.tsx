import clsx from "clsx";
import { ArrowsClockwise, Database } from "@phosphor-icons/react";
import type { MemoryItem, Stats, SyncLogEntry } from "../lib/api";
import type { LiveEvent } from "../hooks/useMemfocData";
import { Panel, SectionHeading } from "../components/ui/Section";

function StatusBadge({ status }: { status: "pending" | "synced" | "failed" }) {
  const styles = {
    synced: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-200 border-amber-500/20",
    failed: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  } as const;
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}

export function ConsoleSection({
  memories,
  syncLog,
  events,
  stats,
  loading,
  onRefresh,
  onSeed,
}: {
  memories: MemoryItem[];
  syncLog: SyncLogEntry[];
  events: LiveEvent[];
  stats: Stats | null;
  loading: boolean;
  onRefresh: () => void;
  onSeed: () => void;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Operations"
        title="Live memory console"
        description="Watch namespace/key items move from pending to synced. WebSocket feed shows background worker activity in real time."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSeed}
              className="rounded-lg border border-mem-line px-4 py-2 text-sm transition hover:border-mem-gold/40"
            >
              Seed demo data
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-lg border border-mem-line p-2 transition hover:text-mem-gold"
            >
              <ArrowsClockwise className={clsx("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total", stats?.total],
          ["Synced", stats?.synced],
          ["Pending", stats?.pending],
          ["Failed", stats?.failed],
        ].map(([label, val]) => (
          <Panel key={String(label)}>
            <p className="text-xs uppercase tracking-wider text-mem-muted">{label}</p>
            <p className="mt-1 font-mono text-2xl text-mem-frost">{val ?? "—"}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Memory index" subtitle="LangGraph namespace · key · CID · sync status">
          {memories.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Database className="h-12 w-12 text-mem-muted" weight="duotone" />
              <p className="mt-4 text-sm font-medium text-mem-frost">No memories indexed yet</p>
              <p className="mt-2 max-w-sm text-sm text-mem-muted">
                Grant reviewers: seed demo data to watch live FOC sync — pending → synced with CIDs.
              </p>
              <button
                type="button"
                onClick={onSeed}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mem-gold to-mem-gold-dim px-6 py-3 text-sm font-bold text-void transition hover:brightness-110 active:scale-[0.98]"
              >
                Seed demo data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-mem-muted">
                  <tr className="border-b border-mem-line">
                    <th className="pb-3 pr-4">Namespace</th>
                    <th className="pb-3 pr-4">Key</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">CID</th>
                  </tr>
                </thead>
                <tbody>
                  {memories.map((m) => (
                    <tr key={`${m.namespace.join("/")}:${m.key}`} className={clsx(
                      "border-b border-mem-line/60 transition-colors",
                      m.sync_status === "pending" && "bg-amber-500/[0.03] animate-pulse",
                    )}>
                      <td className="py-3 pr-4 font-mono text-xs text-mem-mint">
                        {m.namespace.join(" / ")}
                      </td>
                      <td className="py-3 pr-4">{m.key}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={m.sync_status} />
                      </td>
                      <td className="max-w-[200px] truncate py-3 font-mono text-[10px] text-mem-muted">
                        {m.cid ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="WebSocket events" subtitle="sync_start · sync_complete · manifest_committed">
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-sm text-mem-muted">Waiting for events…</p>
              ) : (
                events.map((ev, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-mem-line/70 bg-void/50 px-3 py-2 font-mono text-[10px] text-mem-muted"
                  >
                    <span className="text-mem-gold">{ev.type}</span>{" "}
                    {JSON.stringify(Object.fromEntries(Object.entries(ev).filter(([k]) => k !== "type")))}
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Sync log">
            <div className="space-y-2">
              {syncLog.slice(0, 10).map((row) => (
                <div key={row.id} className="flex justify-between text-xs text-mem-muted">
                  <span className="font-mono truncate">
                    {row.action} · {row.key}
                  </span>
                  <span>{row.duration_ms?.toFixed(0) ?? "—"}ms</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
