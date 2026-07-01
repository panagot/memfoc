import { PlayCircle, VideoCamera } from "@phosphor-icons/react";

/** Set DEMO_VIDEO_URL when the walkthrough is recorded (YouTube/Loom). */
export const DEMO_VIDEO_URL: string | null = null;

export function DemoVideoCTA({ compact = false }: { compact?: boolean }) {
  if (DEMO_VIDEO_URL) {
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
        Watch 3-min demo
      </a>
    );
  }

  return (
    <a
      href="https://github.com/panagot/memfoc/blob/main/docs/DEMO_VIDEO_SCRIPT.md"
      target="_blank"
      rel="noreferrer"
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-xl border border-mem-line bg-void-inset px-3 py-1.5 text-xs font-medium text-mem-muted hover:text-mem-gold"
          : "inline-flex items-center gap-2 rounded-xl border border-mem-line bg-void-inset px-4 py-2.5 text-sm font-medium text-mem-muted transition hover:border-mem-gold/30 hover:text-mem-gold"
      }
    >
      <VideoCamera className="h-4 w-4" weight="duotone" />
      Demo video script
    </a>
  );
}
