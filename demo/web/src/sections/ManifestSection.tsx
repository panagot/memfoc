import { Anchor, ArrowsClockwise, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import type { Stats } from "../lib/api";
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

const CHAIN = [
  { id: "sqlite", label: "SQLite index", detail: "synced rows with CIDs", status: "live" as const },
  { id: "manifest", label: "Manifest JSON", detail: "content-addressed snapshot", status: "live" as const },
  { id: "tx", label: "Anchor record", detail: "local dev tx hash", status: "local" as const },
  { id: "fvm", label: "MemoryManifest.sol", detail: "on-chain verification", status: "planned" as const },
];

export function ManifestSection({
  manifest,
  flushing,
  rebuilding,
  onFlush,
  onRebuild,
}: {
  manifest: Stats["latest_manifest"];
  flushing: boolean;
  rebuilding: boolean;
  onFlush: () => void;
  onRebuild: () => void;
}) {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Verification"
        title="Manifest anchoring"
        description="Periodic snapshots commit memory CIDs for independent audit. Auditors verify without trusting your API."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onFlush}
              disabled={flushing}
              className="inline-flex items-center gap-2 rounded-lg bg-mem-gold px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mem-gold-dim disabled:opacity-50"
            >
              <Anchor className="h-4 w-4" weight="duotone" />
              {flushing ? "Flushing…" : "Flush manifest"}
            </button>
            <button
              type="button"
              onClick={onRebuild}
              disabled={rebuilding}
              className="inline-flex items-center gap-2 rounded-xl border border-mem-line px-4 py-2 text-sm disabled:opacity-50"
            >
              <ArrowsClockwise className="h-4 w-4" />
              {rebuilding ? "Rebuilding…" : "Rebuild index"}
            </button>
          </div>
        }
      />

      <Panel title="Proof chain" subtitle="Flush manifest to advance the chain">
        <div className="flex flex-col gap-0 md:flex-row md:items-stretch md:gap-0">
          {CHAIN.map((step, i) => {
            const active =
              (step.id === "sqlite" && true) ||
              (step.id === "manifest" && !!manifest) ||
              (step.id === "tx" && !!manifest?.tx_hash);
            const dashed = step.status === "planned";
            const badge =
              step.status === "live" ? "Live" : step.status === "local" ? "Local dev" : "Planned";
            return (
              <div key={step.id} className="flex flex-1 flex-col md:flex-row md:items-center">
                <motion.div
                  initial={false}
                  animate={{
                    borderColor: active ? "rgba(0, 144, 255, 0.45)" : "rgba(255,255,255, 0.08)",
                    opacity: dashed ? 0.55 : 1,
                  }}
                  className={`rounded-2xl border bg-void-inset p-4 ${dashed ? "border-dashed" : ""}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mem-gold/80">
                    {badge}
                  </p>
                  <p className="mt-1 font-semibold text-mem-frost">{step.label}</p>
                  <p className="mt-1 text-xs text-mem-muted">{step.detail}</p>
                </motion.div>
                {i < CHAIN.length - 1 && (
                  <div className="my-2 flex justify-center md:my-0 md:mx-2 md:w-8">
                    <div className="h-8 w-px bg-mem-line md:h-px md:w-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-mem-muted">Manifest CID</p>
          <p className="mt-2 truncate font-mono text-xs text-mem-mint">
            {manifest?.manifest_cid ?? "—"}
          </p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-mem-muted">Items anchored</p>
          <p className="mt-2 font-mono text-2xl text-mem-frost">{manifest?.item_count ?? "—"}</p>
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-mem-muted">Tx hash</p>
          <p className="mt-2 truncate font-mono text-xs text-mem-muted">
            {manifest?.tx_hash ?? "—"}
          </p>
          {manifest?.tx_hash && (
            <p className="mt-1 text-[10px] text-mem-muted">Local development record</p>
          )}
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-mem-muted">Committed at</p>
          <p className="mt-2 text-sm text-mem-frost">{manifest?.created_at ?? "—"}</p>
        </Panel>
      </div>

      <Panel title="Manifest structure">
        <CodeBlock
          code={`{
  "version": 1,
  "item_count": 42,
  "created_at": "2026-07-01T12:00:00Z",
  "items": [
    {"namespace": ["users","alice","prefs"], "key": "theme", "cid": "bafy…"}
  ]
}`}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="On-chain anchor">
          <p className="text-sm leading-relaxed text-mem-muted">
            Production ships <code className="text-mem-mint">MemoryManifest.sol</code> on FVM.
            Flush uploads manifest JSON to FOC, then stores{" "}
            <code className="text-mem-mint">(root_hash, manifest_cid, version)</code> on-chain —
            one transaction per snapshot, not per memory write.
          </p>
        </Panel>
        <Panel title="Index rebuild">
          <p className="text-sm leading-relaxed text-mem-muted">
            If SQLite is lost, rebuild walks FOC blobs referenced by the latest manifest.
            The local index is a cache; FOC + manifest are the durable source of truth.
          </p>
        </Panel>
      </div>

      <Panel>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-mem-gold" weight="duotone" />
          <div>
            <h3 className="font-semibold text-mem-frost">Independent verification flow</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-mem-muted">
              <li>Read manifest CID from FVM contract</li>
              <li>Download manifest JSON from Filecoin Onchain Cloud</li>
              <li>Recompute root_hash from entry CIDs</li>
              <li>Spot-check any memory blob by CID</li>
            </ol>
          </div>
        </div>
      </Panel>
    </div>
  );
}
