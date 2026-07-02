import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PaperPlaneTilt, Sparkle, X } from "@phosphor-icons/react";
import { LogoMark } from "../brand/LogoMark";
import type { SectionId } from "../../data/navigation";
import { api } from "../../lib/api";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "How does FilecoinStore work?",
  "How does MemFOC compare to Mem0?",
  "Walk me through the demo",
];

function renderMarkdownish(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j} className="font-semibold text-mem-gold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  ));
}

export function AssistantChat({
  section,
  onClose,
  open,
}: {
  section: SectionId;
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the MemFOC guide. Ask about architecture, the live demo, integration, or how we compare to PostgresStore and Mem0.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setBusy(true);
    try {
      const res = await api.assistantChat(q, section);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "API offline — start `python -m demo.server.main` for live answers.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-24 right-5 z-[60] flex w-[min(100vw-2.5rem,380px)] flex-col overflow-hidden rounded-xl border border-mem-line bg-void-raised shadow-card"
        >
          <header className="flex items-center justify-between border-b border-mem-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <LogoMark size={22} />
              <div>
                <p className="text-sm font-semibold text-mem-frost">MemFOC Guide</p>
                <p className="text-xs text-mem-muted">Architecture & integration</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-mem-muted hover:text-mem-frost"
            >
              <X className="h-4 w-4" weight="light" />
            </button>
          </header>

          <div className="flex max-h-[340px] min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-mem-gold/15 text-mem-frost"
                    : "mr-auto border border-mem-line bg-void-inset text-mem-muted",
                )}
              >
                {renderMarkdownish(m.content)}
              </div>
            ))}
            {busy && (
              <div className="mr-auto flex gap-1 rounded-2xl border border-mem-line bg-void-inset px-3 py-2">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-mem-gold"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length < 3 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-mem-line px-2.5 py-1 text-[10px] text-mem-muted transition hover:border-mem-gold/30 hover:text-mem-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2 border-t border-mem-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about architecture, demo, integration…"
              className="min-w-0 flex-1 rounded-xl border border-mem-line bg-void px-3 py-2 text-sm text-mem-frost outline-none focus:border-mem-gold/40"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-mem-gold p-2.5 text-void disabled:opacity-50"
            >
              <PaperPlaneTilt className="h-4 w-4" weight="fill" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AssistantFab({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "fixed bottom-5 right-5 z-[55] flex h-12 w-12 items-center justify-center rounded-lg border shadow-card transition-colors duration-200",
        active
          ? "border-mem-gold/40 bg-void-surface text-mem-gold"
          : "border-mem-gold/30 bg-mem-gold text-white hover:bg-mem-gold-dim",
      )}
      aria-label="Open MemFOC guide chat"
    >
      {active ? (
        <X className="h-5 w-5" />
      ) : (
        <Sparkle className="h-5 w-5" weight="fill" />
      )}
    </button>
  );
}
