import clsx from "clsx";
import type { SectionId } from "../../data/navigation";
import {
  PRIMARY_NAV,
  QUICK_LINKS,
  SIDEBAR_NAV,
  type NavItem,
} from "../../data/navigation";
import { Logo } from "../brand/Logo";

export function Sidebar({
  active,
  onNavigate,
  apiOnline,
  mobileMode = false,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  apiOnline: boolean;
  mobileMode?: boolean;
}) {
  const sidebarGroups = [
    { label: "Deep dive", items: SIDEBAR_NAV.filter((n) => n.group === "Deep dive") },
    { label: "Operations", items: SIDEBAR_NAV.filter((n) => n.group === "Operations") },
  ];

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-mem-line bg-void-raised lg:w-[248px]">
      <div className="border-b border-mem-line px-5 py-5">
        <button
          type="button"
          onClick={() => onNavigate("overview")}
          className="w-full text-left"
          aria-label="MemFOC home"
        >
          <Logo size="md" showTagline />
        </button>
        <div className="mt-4 flex items-center gap-2 text-xs text-mem-muted">
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              apiOnline ? "bg-mem-mint" : "bg-rose-400",
            )}
          />
          <span>{apiOnline ? "API connected" : "API offline"} · localhost:8787</span>
        </div>
      </div>

      {mobileMode && (
        <nav className="border-b border-mem-line px-3 py-3 lg:hidden">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-mem-muted">
            Main
          </p>
          <ul className="space-y-0.5">
            {PRIMARY_NAV.map((item) => (
              <SidebarButton
                key={item.id}
                item={item}
                isActive={active === item.id}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </nav>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-mem-muted">
          {mobileMode ? "More" : "Explore"}
        </p>
        {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-wider text-mem-muted/70">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarButton
                  key={item.id}
                  item={item}
                  isActive={active === item.id}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-mem-line px-4 py-4">
        <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wider text-mem-muted/70">
          Resources
        </p>
        <ul className="space-y-1">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md px-1 py-1 text-xs text-mem-muted transition-colors hover:text-mem-gold"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SidebarButton({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: (id: SectionId) => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <button
        type="button"
        onClick={() => onNavigate(item.id)}
        className={clsx(
          "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-200",
          isActive
            ? "bg-mem-gold/10 text-mem-frost"
            : "text-mem-muted hover:bg-white/[0.03] hover:text-mem-frost",
        )}
      >
        <Icon
          className={clsx("h-4 w-4 shrink-0", isActive ? "text-mem-gold" : "text-mem-muted")}
          weight={isActive ? "duotone" : "regular"}
        />
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );
}
