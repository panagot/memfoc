import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";
import { ArrowSquareOut } from "@phosphor-icons/react";
import type { SectionId } from "../../data/navigation";
import { NAV_GROUPS, QUICK_LINKS, type NavItem } from "../../data/navigation";
import { Logo } from "../brand/Logo";
import { cn } from "../../lib/cn";

export function AppSidebar({
  active,
  onNavigate,
  apiOnline,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  apiOnline: boolean;
}) {
  return (
    <aside className="flex h-full w-[252px] shrink-0 flex-col border-r border-mem-line bg-[#0C0C0E]">
      <div className="px-5 py-5">
        <button
          type="button"
          onClick={() => onNavigate("overview")}
          className="w-full text-left"
          aria-label="MemFOC home"
        >
          <Logo size="md" showTagline />
        </button>
      </div>

      <Separator.Root className="h-px bg-mem-line" />

      <ScrollArea.Root className="min-h-0 flex-1">
        <ScrollArea.Viewport className="h-full w-full">
          <nav className="px-3 py-4">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} className={cn(gi > 0 && "mt-6")}>
                <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-mem-muted/80">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavRow
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
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex w-1.5 touch-none select-none p-0.5"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-full bg-white/10" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      <Separator.Root className="h-px bg-mem-line" />

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2 rounded-md border border-mem-line bg-void-surface px-3 py-2">
          <span
            className={clsx(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              apiOnline ? "bg-emerald-500" : "bg-rose-500",
            )}
          />
          <span className="text-xs text-mem-muted">
            {apiOnline ? "API live" : "API offline"}
          </span>
        </div>
        <ul className="space-y-1">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-mem-muted transition-colors hover:text-mem-frost"
              >
                {link.label}
                <ArrowSquareOut className="h-3 w-3 opacity-50" weight="bold" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function NavRow({
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
        className={cn(
          "group relative flex w-full items-center gap-2.5 rounded-md py-2 pl-3 pr-2 text-left text-[13px] transition-colors",
          isActive
            ? "bg-white/[0.06] text-mem-frost"
            : "text-mem-muted hover:bg-white/[0.03] hover:text-mem-frost",
        )}
      >
        {isActive && (
          <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-mem-gold" />
        )}
        <Icon
          className={cn("h-4 w-4 shrink-0", isActive ? "text-mem-gold" : "text-mem-muted/80")}
          weight={isActive ? "fill" : "regular"}
        />
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  );
}
