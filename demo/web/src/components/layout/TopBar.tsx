import clsx from "clsx";
import { List, X } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { getSection, PRIMARY_NAV } from "../../data/navigation";
import { Logo } from "../brand/Logo";
import { DemoVideoCTA } from "../grant/DemoVideoCTA";

export function TopBar({
  active,
  onNavigate,
  onToggleSidebar,
  sidebarOpen,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const current = getSection(active);

  return (
    <header className="sticky top-0 z-20 px-4 pt-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-xl border border-mem-line bg-void-raised/90 p-2.5 text-mem-muted backdrop-blur-xl transition hover:text-mem-frost lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" weight="light" /> : <List className="h-5 w-5" weight="light" />}
        </button>

        {/* Floating island nav bar */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl border border-mem-line bg-void-raised/80 px-3 py-2 shadow-bezel backdrop-blur-xl md:px-4">
          <div className="hidden shrink-0 lg:block">
            <Logo size="sm" />
          </div>

          {/* Primary nav — desktop */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-500 ease-spring",
                  active === item.id
                    ? "bg-mem-gold/15 text-mem-gold ring-1 ring-mem-gold/25"
                    : "text-mem-muted hover:text-mem-frost",
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile: current section label only */}
          <div className="min-w-0 flex-1 lg:hidden">
            <p className="truncate font-display text-sm font-semibold text-mem-frost">
              {current?.label ?? "MemFOC"}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <DemoVideoCTA compact />
            <span className="rounded-full border border-mem-mint/25 bg-mem-mint/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-mem-mint">
              Prototype
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
