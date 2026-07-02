import clsx from "clsx";
import { List, X } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { getSection, PRIMARY_NAV } from "../../data/navigation";
import { LogoMark } from "../brand/LogoMark";
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
    <header className="sticky top-0 z-20 border-b border-mem-line bg-void/95 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6 lg:pl-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-mem-muted transition-colors hover:bg-white/[0.04] hover:text-mem-frost lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => onNavigate("overview")}
              className="shrink-0"
              aria-label="MemFOC home"
            >
              <LogoMark size={24} />
            </button>
            <p className="truncate text-sm font-medium text-mem-frost">{current?.label ?? "MemFOC"}</p>
          </div>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {PRIMARY_NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active === item.id
                    ? "text-mem-frost"
                    : "text-mem-muted hover:text-mem-frost",
                )}
              >
                {item.label}
                {active === item.id && (
                  <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-mem-gold" />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden shrink-0 md:block">
            <DemoVideoCTA compact />
          </div>
        </div>
      </div>
    </header>
  );
}
