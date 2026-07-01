import { BezelPanel } from "../ui/Bezel";
import { GRANT_WHY_FUND, RFS_ALIGNMENT } from "../../data/docs";

const BUDGET = [
  { label: "M1 Core store", amount: 2000, color: "#E3B341" },
  { label: "M2 Synapse", amount: 2500, color: "#1DE9B6" },
  { label: "M3 FVM contract", amount: 1500, color: "#7AB8FF" },
  { label: "M4 Mainnet", amount: 1000, color: "#F0D078" },
];

export function BudgetBar() {
  const total = BUDGET.reduce((s, b) => s + b.amount, 0);
  return (
    <div data-grant-budget className="space-y-3">
      <div className="flex h-4 overflow-hidden rounded-full bg-void-inset ring-1 ring-mem-line">
        {BUDGET.map((b) => (
          <div
            key={b.label}
            className="h-full transition-all duration-700"
            style={{ width: `${(b.amount / total) * 100}%`, backgroundColor: b.color }}
            title={`${b.label}: $${b.amount.toLocaleString()}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {BUDGET.map((b) => (
          <div key={b.label} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-mem-muted">{b.label}</span>
            <span className="ml-auto font-mono font-semibold text-mem-frost">
              ${(b.amount / 1000).toFixed(1)}K
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyFundSection() {
  return (
    <BezelPanel title="Why fund MemFOC?" subtitle="Three reasons FIL Builder reviewers say yes">
      <div className="grid gap-4 md:grid-cols-3">
        {GRANT_WHY_FUND.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-mem-line bg-void-inset p-4"
          >
            <p className="font-mono text-2xl font-bold text-mem-gold">{item.stat}</p>
            <p className="mt-2 font-display text-sm font-semibold text-mem-frost">{item.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-mem-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </BezelPanel>
  );
}

export function RfsAlignmentCallout() {
  return (
    <BezelPanel title="Filecoin RFS-1 alignment" subtitle="Explicit agent memory infrastructure ask">
      <ul className="space-y-3">
        {RFS_ALIGNMENT.map((item) => (
          <li key={item.requirement} className="flex gap-3 text-sm">
            <span className="mt-0.5 shrink-0 text-mem-mint">✓</span>
            <div>
              <p className="font-medium text-mem-frost">{item.requirement}</p>
              <p className="mt-0.5 text-xs text-mem-muted">{item.memfoc_answer}</p>
            </div>
          </li>
        ))}
      </ul>
    </BezelPanel>
  );
}
