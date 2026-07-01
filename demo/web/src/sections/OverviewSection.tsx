import { motion } from "framer-motion";
import { CheckCircle, Stack } from "@phosphor-icons/react";
import type { SectionId } from "../data/navigation";
import {
  BUILDING_NOW,
  PRODUCT_TAGLINE,
  PROBLEM_POINTS,
  VALUE_PROPS,
} from "../data/docs";
import { HeroIllustration } from "../components/graphics/HeroIllustration";
import { ArchitectureFlow } from "../components/graphics/ArchitectureFlow";
import { TrustBadges } from "../components/grant/JudgeTourBanner";
import {
  Bezel,
  BezelPanel,
  Eyebrow,
  PrimaryButton,
  SectionIntro,
  StatTile,
} from "../components/ui/Bezel";
import type { Stats } from "../lib/api";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
};

export function OverviewSection({
  stats,
  onNavigate,
}: {
  stats: Stats | null;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero bento */}
      <section className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <motion.div {...fade} className="lg:col-span-7">
          <Bezel glow="gold" className="h-full">
            <div className="relative overflow-hidden p-8 md:p-12 lg:p-14">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-mem-gold/10 blur-3xl" />
              <Eyebrow>FIL Builder · LangGraph × Filecoin</Eyebrow>
              <p className="mt-6 font-display text-2xl font-bold leading-snug text-mem-frost md:text-3xl">
                PostgresStore semantics.{" "}
                <span className="text-gradient-gold">Filecoin durability.</span>
              </p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-mem-muted md:text-lg">
                {PRODUCT_TAGLINE}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <PrimaryButton onClick={() => onNavigate("demo")}>Start guided demo</PrimaryButton>
                <PrimaryButton variant="ghost" onClick={() => onNavigate("grant")}>
                  View grant roadmap
                </PrimaryButton>
              </div>
              <TrustBadges />
            </div>
          </Bezel>
        </motion.div>

        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <Bezel className="h-full">
            <div className="p-3 md:p-4">
              <HeroIllustration />
            </div>
          </Bezel>
        </motion.div>
      </section>

      {/* Live stats */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <Eyebrow>Live prototype</Eyebrow>
          <button
            type="button"
            onClick={() => onNavigate("console")}
            className="text-xs font-medium text-mem-gold transition hover:text-mem-frost"
          >
            Open console →
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Memories indexed" value={stats?.total ?? "—"} accent="gold" />
          <StatTile label="FOC synced" value={stats?.synced ?? "—"} accent="mint" />
          <StatTile label="Pending upload" value={stats?.pending ?? "—"} />
          <StatTile
            label="Backend"
            value={stats?.backend?.replace("MockFOC", "Mock ") ?? "—"}
            hint="Synapse on testnet (grant M2)"
          />
        </div>
      </section>

      {/* Value props bento */}
      <section>
        <SectionIntro
          eyebrow="Why MemFOC"
          title="Built for agents that need to remember — and prove it"
          description="Filecoin RFS-1 calls for Mem0-style memory, decentralized. MemFOC is the native BaseStore adapter — not another SDK wrapper."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <BezelPanel className="h-full">
                <p className="font-mono text-2xl font-bold text-mem-gold">{v.stat}</p>
                <h3 className="mt-3 font-display text-base font-semibold text-mem-frost">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mem-muted">{v.body}</p>
              </BezelPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section>
        <SectionIntro
          eyebrow="The gap"
          title="Why PostgresStore is not enough"
          description="Centralized stores work until you need portability, audit trails, or decentralized durability."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {PROBLEM_POINTS.map((p) => (
            <BezelPanel key={p.title} title={p.title}>
              <p className="text-sm leading-relaxed text-mem-muted">{p.body}</p>
            </BezelPanel>
          ))}
        </div>
      </section>

      {/* Architecture preview */}
      <section>
        <SectionIntro
          eyebrow="Architecture"
          title="Four layers, one BaseStore API"
          description="Hot path stays local. Cold path syncs to Filecoin. Manifest anchors periodically — never per write."
          action={
            <PrimaryButton variant="ghost" onClick={() => onNavigate("architecture")}>
              Full architecture
            </PrimaryButton>
          }
        />
        <Bezel>
          <div className="p-4 md:p-6">
            <ArchitectureFlow />
          </div>
        </Bezel>
      </section>

      {/* Building now */}
      <section>
        <SectionIntro
          eyebrow="Roadmap"
          title="What exists today vs. grant deliverables"
          description="This prototype is real, runnable code — not a mockup. Grant funding ships testnet FOC and FVM."
        />
        <BezelPanel
          title="Build status"
          subtitle="Green = shipped in repo · Gold = FIL Builder Next Step milestone"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {BUILDING_NOW.map((b) => (
              <div
                key={b.item}
                className="flex items-start gap-3 rounded-2xl border border-mem-line bg-void-inset p-4"
              >
                {b.status === "done" ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-mem-mint" weight="duotone" />
                ) : (
                  <Stack className="mt-0.5 h-5 w-5 shrink-0 text-mem-gold" weight="duotone" />
                )}
                <div>
                  <p className="text-sm font-semibold text-mem-frost">{b.item}</p>
                  <p className="mt-1 text-xs text-mem-muted">{b.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </BezelPanel>
      </section>
    </div>
  );
}
