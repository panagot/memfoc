import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Bezel({
  children,
  className,
  glow: _glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "gold" | "mint" | false;
}) {
  return (
    <div className={cn("rounded-lg border border-mem-line bg-[#0C0C0E]", className)}>
      {children}
    </div>
  );
}

export function BezelPanel({
  children,
  className,
  title,
  subtitle,
  header,
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  padding?: boolean;
}) {
  return (
    <Bezel className={className}>
      {(title || subtitle || header) && (
        <header className="flex items-start justify-between gap-4 border-b border-mem-line px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-medium text-mem-frost">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-mem-muted">{subtitle}</p>}
          </div>
          {header}
        </header>
      )}
      <div className={padding ? "p-5" : ""}>{children}</div>
    </Bezel>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-xs font-medium uppercase tracking-wider text-mem-muted">{children}</span>;
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = "gold",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "gold" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center rounded-md border border-mem-line px-4 py-2 text-sm font-medium text-mem-frost transition-colors hover:border-mem-line-strong hover:bg-white/[0.02] disabled:opacity-50"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center rounded-md bg-mem-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0078D4] disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function StatTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "gold" | "mint";
}) {
  return (
    <div className="rounded-lg border border-mem-line bg-[#0C0C0E] px-4 py-3">
      <p className="text-xs text-mem-muted">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-2xl tabular-nums",
          accent === "mint" ? "text-mem-mint" : accent === "gold" ? "text-mem-gold" : "text-mem-frost",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-[11px] text-mem-muted">{hint}</p>}
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs text-mem-muted">{eyebrow}</p>}
        <h2 className="text-xl font-semibold tracking-tight text-mem-frost md:text-2xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-mem-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-mem-line bg-[#0C0C0E] px-4 py-3 font-mono text-xs leading-relaxed text-mem-frost/90">
      <code>{code}</code>
    </pre>
  );
}
