import { motion } from "framer-motion";
import { Cloud, Graph, ShieldCheck, UserCircle } from "@phosphor-icons/react";
import type { SectionId } from "../data/navigation";
import { USE_CASES, USE_CASE_TAGS } from "../data/docs";
import { BezelPanel, PrimaryButton, SectionIntro } from "../components/ui/Bezel";

const ICONS = {
  user: UserCircle,
  shield: ShieldCheck,
  graph: Graph,
  cloud: Cloud,
} as const;

export function UseCasesSection({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <div className="space-y-16">
      <SectionIntro
        eyebrow="Use cases"
        title="Who needs verifiable agent memory?"
        description="MemFOC targets production LangGraph deployments where memory must survive infra changes, satisfy auditors, or sync across agents — with the same store API you already use."
        action={
          <PrimaryButton onClick={() => onNavigate("demo")}>Try the demo</PrimaryButton>
        }
      />

      <div className="space-y-6">
        {USE_CASES.map((uc, i) => {
          const Icon = ICONS[uc.icon as keyof typeof ICONS] ?? UserCircle;
          return (
            <motion.div
              key={uc.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            >
              <BezelPanel>
                <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mem-gold/10 ring-1 ring-mem-gold/25">
                    <Icon className="h-7 w-7 text-mem-gold" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-mem-frost">{uc.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(USE_CASE_TAGS[uc.id] ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-mem-line bg-void-inset px-2 py-0.5 text-[10px] font-medium text-mem-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.04] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-300/80">
                          Problem
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-mem-muted">{uc.problem}</p>
                      </div>
                      <div className="rounded-xl border border-mem-mint/15 bg-mem-mint/[0.04] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-mem-mint/80">
                          MemFOC solution
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-mem-muted">{uc.solution}</p>
                      </div>
                    </div>
                    <pre className="mt-4 overflow-x-auto rounded-xl border border-mem-line bg-void px-4 py-3 font-mono text-xs text-mem-gold/90">
                      {uc.example}
                    </pre>
                  </div>
                </div>
              </BezelPanel>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
