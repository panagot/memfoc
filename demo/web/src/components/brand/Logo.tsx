import { LogoMark } from "./LogoMark";

export function Logo({
  size = "md",
  showTagline = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}) {
  const markSize = size === "sm" ? 32 : size === "lg" ? 52 : 40;
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div className="absolute inset-0 rounded-2xl bg-mem-gold/20 blur-xl" />
        <div className="relative rounded-2xl bg-void-inset p-1.5 ring-1 ring-mem-line-strong">
          <LogoMark size={markSize} />
        </div>
      </div>
      <div>
        <p className={`font-display font-bold tracking-tight text-mem-frost ${textSize}`}>
          Mem<span className="text-gradient-gold">FOC</span>
        </p>
        {showTagline && (
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-mem-muted">
            LangGraph × Filecoin
          </p>
        )}
      </div>
    </div>
  );
}
