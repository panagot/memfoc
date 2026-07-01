import clsx from "clsx";
import type { SectionId } from "../../data/navigation";
import {
  JUDGE_HIGHLIGHTS,
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
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-mem-line bg-void-raised/95 backdrop-blur-xl lg:w-[240px]">
      <div className="border-b border-mem-line px-5 py-6">
        <Logo size="md" showTagline />
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-mem-line bg-void-inset px-3 py-2">
          <span
            className={clsx(
              "relative h-2 w-2 rounded-full",
              apiOnline ? "bg-mem-mint" : "bg-rose-400",
            )}
          >
            {apiOnline && (
              <span className="absolute inset-0 animate-ping rounded-full bg-mem-mint opacity-40" />
            )}
          </span>
          <span className="text-[10px] text-mem-muted">
            {apiOnline ? "Live API" : "Offline"} · :8787
          </span>
        </div>
      </div>

      {mobileMode && (
        <nav className="border-b border-mem-line px-3 py-4 lg:hidden">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mem-muted/70">
            Main
          </p>
          <ul className="space-y-1">
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
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-mem-gold/80">
          {mobileMode ? "More sections" : "Explore deeper"}
        </p>
        {sidebarGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-wider text-mem-muted/60">
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

        <div className="mx-2 mt-4 rounded-2xl border border-mem-gold/20 bg-mem-gold/[0.04] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-mem-gold">
            Judge checklist
          </p>
          <ul className="mt-2 space-y-2">
            {JUDGE_HIGHLIGHTS.map((h) => (
              <li key={h.label}>
                <p className="text-[11px] font-semibold text-mem-frost">{h.label}</p>
                <p className="font-mono text-[9px] text-mem-muted">{h.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-mem-line px-4 py-4">
        <p className="mb-1.5 px-1 text-[9px] font-bold uppercase tracking-wider text-mem-muted/70">
          Resources
        </p>
        <ul className="space-y-0.5">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg px-1 py-1 text-[11px] text-mem-muted hover:text-mem-gold"
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
          "group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-500 ease-spring",
          isActive
            ? "bg-mem-gold/[0.08] ring-1 ring-mem-gold/25"
            : "hover:bg-white/[0.03]",
        )}
      >
        <Icon
          className={clsx(
            "h-4 w-4 shrink-0",
            isActive ? "text-mem-gold" : "text-mem-muted group-hover:text-mem-frost",
          )}
          weight={isActive ? "duotone" : "light"}
        />
        <span
          className={clsx(
            "text-[13px] font-medium",
            isActive ? "text-mem-frost" : "text-mem-muted group-hover:text-mem-frost",
          )}
        >
          {item.label}
        </span>
      </button>
    </li>
  );
}
