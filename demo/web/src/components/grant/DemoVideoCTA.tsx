import { PlayCircle } from "@phosphor-icons/react";

/** Set when the walkthrough is recorded (YouTube/Loom). Hidden until then. */
export const DEMO_VIDEO_URL: string | null = null;

export function DemoVideoCTA({ compact = false }: { compact?: boolean }) {
  if (!DEMO_VIDEO_URL) return null;

  return (
    <a
      href={DEMO_VIDEO_URL}
      target="_blank"
      rel="noreferrer"
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-xl border border-mem-gold/40 bg-mem-gold/10 px-3 py-1.5 text-xs font-semibold text-mem-gold"
          : "inline-flex items-center gap-2 rounded-xl border border-mem-gold/40 bg-mem-gold/10 px-4 py-2.5 text-sm font-semibold text-mem-gold transition hover:bg-mem-gold/15"
      }
    >
      <PlayCircle className="h-4 w-4" weight="fill" />
      Watch demo
    </a>
  );
}
