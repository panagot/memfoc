import type { ReactNode } from "react";
import { BezelPanel, SectionIntro } from "./Bezel";

export {
  Bezel,
  BezelPanel,
  Eyebrow,
  PrimaryButton,
  StatTile,
  CodeBlock,
  SectionIntro,
} from "./Bezel";

export function Panel({
  children,
  className,
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <BezelPanel className={className} title={title} subtitle={subtitle}>
      {children}
    </BezelPanel>
  );
}

export function SectionHeading({
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
    <SectionIntro eyebrow={eyebrow} title={title} description={description} action={action} />
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-mem-line bg-void-inset px-3 py-1.5">
      <span className="text-xs text-mem-muted">{label}</span>
      <span className="font-mono text-xs font-medium text-mem-gold">{value}</span>
    </div>
  );
}
