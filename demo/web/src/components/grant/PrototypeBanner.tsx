import { Info } from "@phosphor-icons/react";

const BADGES = [
  { label: "Prototype backend", detail: "FOC simulated locally" },
  { label: "Contract simulation", detail: "FVM tx hash simulated" },
  { label: "Production pending", detail: "Synapse + mainnet (M2–M4)" },
];

export function PrototypeBanner() {
  return (
    <div className="mx-4 mb-4 rounded-2xl border border-mem-mint/20 bg-mem-mint/[0.04] px-4 py-3 md:mx-0">
      <div className="flex flex-wrap items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-mem-mint" weight="duotone" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-mem-frost">
            Working end-to-end prototype — architecture validated, Filecoin integration grant-funded
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-mem-muted">
            Memory is content-addressed with PDP proofs and periodically anchored on-chain for
            independent verification. Today uses simulated FOC/FVM; grant milestones ship real
            Synapse uploads and MemoryManifest.sol.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex flex-col rounded-xl border border-mem-line bg-void-inset px-2.5 py-1.5"
              >
                <span className="text-[10px] font-semibold text-mem-mint">{b.label}</span>
                <span className="text-[9px] text-mem-muted">{b.detail}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
