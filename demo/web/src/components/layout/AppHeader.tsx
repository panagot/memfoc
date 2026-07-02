import { List, X } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { getSection } from "../../data/navigation";
import { LogoMark } from "../brand/LogoMark";

export function AppHeader({
  active,
  sidebarOpen,
  onToggleSidebar,
}: {
  active: SectionId;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const current = getSection(active);

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-mem-line bg-void px-4 lg:hidden">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="rounded-md p-2 text-mem-muted hover:bg-white/[0.04] hover:text-mem-frost"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </button>
      <LogoMark size={22} />
      <span className="truncate text-sm font-medium text-mem-frost">{current?.label}</span>
    </header>
  );
}
