import { useCallback, useEffect, useState } from "react";
import { api, MemoryItem, Stats, SyncLogEntry } from "../lib/api";

export type LiveEvent = { type: string; [key: string]: unknown };

export function useMemfocData() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [syncLog, setSyncLog] = useState<SyncLogEntry[]>([]);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [s, m, log] = await Promise.all([
        api.stats(),
        api.memories(),
        api.syncLog(),
      ]);
      setStats(s);
      setMemories(m);
      setSyncLog(log);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "API unreachable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    let ws: WebSocket | undefined;
    try {
      ws = new WebSocket(api.wsUrl());
      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data) as LiveEvent;
          setEvents((prev) => [event, ...prev].slice(0, 20));
          if (
            event.type === "sync_complete" ||
            event.type === "manifest_committed" ||
            event.type === "benchmark_complete"
          ) {
            refresh();
          }
        } catch {
          /* ignore */
        }
      };
      ws.onerror = () => ws?.close();
    } catch {
      /* WebSocket unavailable (e.g. serverless) — polling still runs */
    }
    return () => ws?.close();
  }, [refresh]);

  return { stats, memories, syncLog, events, loading, error, refresh };
}
