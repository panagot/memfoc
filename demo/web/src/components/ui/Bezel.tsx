import clsx from "clsx";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

/** Double-bezel card shell */
export function Bezel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "gold" | "mint" | false;
}) {
  return (
    <div
      className={clsx(
        "rounded-4xl bg-white/[0.03] p-1.5 ring-1 ring-mem-line",
        glow === "gold" && "shadow-glow",
        glow === "mint" && "shadow-glow-mint",
        className,
      )}
    >
      <div className="rounded-[calc(2rem-0.375rem)] bg-void-surface shadow-bezel-inner">
        {children}
      </div>
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
        <header className="flex items-start justify-between gap-4 border-b border-mem-line px-6 py-5">
          <div>
            {title && (
              <h3 className="font-display text-base font-semibold tracking-tight text-mem-frost">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-1 text-xs leading-relaxed text-mem-muted">{subtitle}</p>}
          </div>
          {header}
        </header>
      )}
      <div className={padding ? "p-6 md:p-7" : ""}>{children}</div>
    </Bezel>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-mem-gold/25 bg-mem-gold/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-mem-gold">
      {children}
    </span>
  );
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
        className="group inline-flex items-center gap-2 rounded-full border border-mem-line-strong bg-white/[0.03] px-6 py-3 text-sm font-semibold text-mem-frost transition-all duration-500 ease-spring hover:border-mem-gold/30 hover:bg-white/[0.06] active:scale-[0.98] disabled:opacity-50"
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
      className="group inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-mem-gold to-mem-gold-dim py-1.5 pl-6 pr-1.5 text-sm font-bold text-void transition-all duration-500 ease-spring hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
    >
      <span>{children}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
        <ArrowUpRight className="h-4 w-4" weight="bold" />
      </span>
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
    <Bezel glow={accent === "gold" ? "gold" : accent === "mint" ? "mint" : false}>
      <div className="p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mem-muted">
          {label}
        </p>
        <p
          className={clsx(
            "mt-2 font-mono text-3xl font-semibold tracking-tight",
            accent === "mint" ? "text-mem-mint" : accent === "gold" ? "text-mem-gold" : "text-mem-frost",
          )}
        >
          {value}
        </p>
        {hint && <p className="mt-1.5 text-xs text-mem-muted">{hint}</p>}
      </div>
    </Bezel>
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
    <div className="mb-10 flex flex-col gap-6 pb-8 md:mb-14 md:flex-row md:items-end md:justify-between md:pb-10">
      <div className="max-w-3xl">
        {eyebrow && <div className="mb-4">{typeof eyebrow === "string" ? <Eyebrow>{eyebrow}</Eyebrow> : eyebrow}</div>}
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-mem-frost md:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-mem-muted md:text-lg">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-mem-line bg-void px-5 py-4 font-mono text-xs leading-relaxed text-mem-mint/90">
      <code>{code}</code>
    </pre>
  );
}
