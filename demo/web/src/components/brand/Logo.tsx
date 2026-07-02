import { LogoMark } from "./LogoMark";

export function Logo({
  size = "md",
  showTagline = false,
  markOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  markOnly?: boolean;
}) {
  const markSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg";

  if (markOnly) {
    return <LogoMark size={markSize} />;
  }

  return (
    <div className="flex items-center gap-3">
      <LogoMark size={markSize} />
      <div className="min-w-0">
        <p className={`font-semibold leading-none tracking-tight text-mem-frost ${textSize}`}>
          Mem<span className="text-mem-gold">FOC</span>
        </p>
        {showTagline && (
          <p className="mt-1 text-xs text-mem-muted">LangGraph memory on Filecoin</p>
        )}
      </div>
    </div>
  );
}
