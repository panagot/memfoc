import type { SectionId } from "../data/navigation";
import {
  HERO_CODE,
  HERO_HEADLINE,
  HERO_SUBHEAD,
  HERO_WHY,
  PROBLEM_POINTS,
  RECOVERY_INVARIANT,
  VALUE_PROPS,
} from "../data/docs";
import { ArchitectureFlow } from "../components/graphics/ArchitectureFlow";
import { HeroIllustration } from "../components/graphics/HeroIllustration";
import {
  Bezel,
  BezelPanel,
  PrimaryButton,
  SectionIntro,
  StatTile,
} from "../components/ui/Bezel";
import type { Stats } from "../lib/api";

export function OverviewSection({
  stats,
  onNavigate,
}: {
  stats: Stats | null;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <div className="space-y-16 md:space-y-20">
      <section>
        <p className="text-sm text-mem-muted">LangGraph BaseStore on Filecoin</p>
        <h1 className="mt-3 max-w-2xl text-[1.75rem] font-semibold leading-snug tracking-tight text-mem-frost md:text-4xl md:leading-tight">
          {HERO_HEADLINE}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-mem-muted">{HERO_SUBHEAD}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton onClick={() => onNavigate("demo")}>Start guided demo</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={() => onNavigate("architecture")}>
            Architecture
          </PrimaryButton>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-mem-line bg-[#0C0C0E]">
        <HeroIllustration />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <h2 className="text-sm font-medium text-mem-frost">Quick start</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-mem-line bg-[#0C0C0E] p-4 font-mono text-xs leading-relaxed text-mem-frost/90">
            {HERO_CODE}
          </pre>
          <ul className="mt-5 space-y-2">
            {HERO_WHY.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-mem-muted">
                <span className="text-mem-gold">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <StatTile label="Memories" value={stats?.total ?? "—"} accent="gold" />
          <StatTile label="Synced" value={stats?.synced ?? "—"} accent="mint" />
          <StatTile label="Pending" value={stats?.pending ?? "—"} />
          <StatTile
            label="Backend"
            value={stats?.backend?.replace("MockFOC", "Local") ?? "—"}
          />
        </div>
      </section>

      <section>
        <SectionIntro
          title="Why MemFOC"
          description="Same BaseStore API as PostgresStore, with content-addressed durability on Filecoin."
        />
        <div className="divide-y divide-mem-line rounded-lg border border-mem-line">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="grid gap-2 px-5 py-4 sm:grid-cols-[80px_1fr] sm:gap-6">
              <p className="font-mono text-lg font-medium text-mem-gold">{v.stat}</p>
              <div>
                <h3 className="font-medium text-mem-frost">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-mem-muted">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro
          title="Why PostgresStore is not enough"
          description="Centralized stores work until you need portability, audit trails, or decentralized durability."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEM_POINTS.map((p) => (
            <BezelPanel key={p.title} title={p.title}>
              <p className="text-sm leading-relaxed text-mem-muted">{p.body}</p>
            </BezelPanel>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro
          title="Architecture"
          description="Hot path stays local. Cold path syncs to Filecoin. Manifest anchors periodically."
          action={
            <PrimaryButton variant="ghost" onClick={() => onNavigate("process")}>
              How it works
            </PrimaryButton>
          }
        />
        <Bezel>
          <div className="p-4 md:p-6">
            <ArchitectureFlow />
          </div>
        </Bezel>
      </section>

      <section>
        <BezelPanel title="Disaster recovery">
          <p className="text-sm leading-relaxed text-mem-muted">{RECOVERY_INVARIANT}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PrimaryButton variant="ghost" onClick={() => onNavigate("manifest")}>
              Manifest & recovery
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={() => onNavigate("roadmap")}>
              Roadmap
            </PrimaryButton>
          </div>
        </BezelPanel>
      </section>
    </div>
  );
}
