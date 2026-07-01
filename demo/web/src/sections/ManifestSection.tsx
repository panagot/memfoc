import { Anchor, ArrowsClockwise, ShieldCheck } from "@phosphor-icons/react";
import type { Stats } from "../lib/api";
import { CodeBlock, Panel, SectionHeading } from "../components/ui/Section";

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
        title="FVM manifest anchoring"
        description="Periodic snapshots commit a Merkle root of all memory CIDs on-chain. Auditors verify without trusting your API."
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onFlush}
              disabled={flushing}
              className="inline-flex items-center gap-2 rounded-xl bg-mem-gold px-4 py-2 text-sm font-semibold text-void disabled:opacity-50"
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
        </Panel>
        <Panel>
          <p className="text-xs uppercase tracking-wider text-mem-muted">Committed at</p>
          <p className="mt-2 text-sm text-mem-frost">{manifest?.created_at ?? "—"}</p>
        </Panel>
      </div>

      <Panel title="Manifest structure (v1 prototype)">
        <CodeBlock
          code={`{
  "version": 3,
  "created_at": "2026-07-01T12:00:00Z",
  "memory_count": 42,
  "root_hash": "0xabc…",
  "entries": [
    {"namespace": ["users","alice","prefs"], "key": "theme", "cid": "bafy…"}
  ]
}`}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="On-chain anchor (grant milestone M3)">
          <p className="text-sm leading-relaxed text-mem-muted">
            Production ships <code className="text-mem-mint">MemoryManifest.sol</code> on FVM.
            Flush uploads manifest JSON to FOC, then stores{" "}
            <code className="text-mem-mint">(root_hash, manifest_cid, version)</code> in contract
            state — one tx per snapshot, not per memory write.
          </p>
        </Panel>
        <Panel title="Index rebuild">
          <p className="text-sm leading-relaxed text-mem-muted">
            If SQLite is lost, rebuild walks FOC blobs referenced by the latest anchored manifest.
            Local index becomes a cache; FOC + FVM are source of truth for verification.
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
              <li>Download manifest JSON from FOC</li>
              <li>Recompute root_hash from entry CIDs</li>
              <li>Spot-check any memory blob by CID</li>
            </ol>
          </div>
        </div>
      </Panel>
    </div>
  );
}
