const API = "http://127.0.0.1:8787";

export type MemoryItem = {
  namespace: string[];
  key: string;
  value: Record<string, unknown>;
  cid: string | null;
  sync_status: "pending" | "synced" | "failed";
  created_at: string;
  updated_at: string;
};

export type Stats = {
  total: number;
  synced: number;
  pending: number;
  failed: number;
  backend: string;
  latest_manifest: {
    manifest_cid: string;
    item_count: number;
    tx_hash: string;
    created_at: string;
  } | null;
};

export type SyncLogEntry = {
  id: number;
  namespace: string;
  key: string;
  action: string;
  cid: string | null;
  duration_ms: number | null;
  created_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  stats: () => request<Stats>("/api/stats"),
  memories: () => request<MemoryItem[]>("/api/memories"),
  syncLog: () => request<SyncLogEntry[]>("/api/sync-log"),
  putMemory: (namespace: string[], key: string, value: Record<string, unknown>) =>
    request<{ sync_status: string }>("/api/memories", {
      method: "POST",
      body: JSON.stringify({ namespace, key, value }),
    }),
  flushManifest: () => request<Record<string, unknown>>("/api/manifest/flush", { method: "POST" }),
  rebuildIndex: () => request<{ rebuilt: number }>("/api/index/rebuild", { method: "POST" }),
  benchmark: () => request<Record<string, { local_write_ms: number; local_read_ms: number; foc_sync_ms: number | null; cid: string | null }>>("/api/benchmark", { method: "POST" }),
  agentRun: (message: string, user_id = "demo-user") =>
    request<{ reply: string; user_id: string }>("/api/agent/run", {
      method: "POST",
      body: JSON.stringify({ message, user_id }),
    }),
  assistantChat: (message: string, section?: string) =>
    request<{ reply: string; agent: string }>("/api/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, section }),
    }),
  designReview: (payload: {
    section: string;
    viewport_w: number;
    viewport_h: number;
    screenshot_b64?: string;
    api_online?: boolean;
    dom?: Record<string, unknown>;
    polish_active?: boolean;
  }) =>
    request<{
      agent: string;
      section: string;
      score: number;
      score_before?: number;
      summary: string;
      rubric?: { id: string; label: string; weight: number; score: number }[];
      suggestions: { severity: string; title: string; detail: string }[];
      applicable_fixes?: { id: string; title: string; detail: string }[];
      applied_fixes?: { id: string; title: string; detail: string }[];
      can_apply?: boolean;
      screenshot_received?: boolean;
    }>("/api/design-review", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  grantFullAudit: (api_online: boolean) =>
    request<{
      agent: string;
      mode: string;
      judge_path: string[];
      priorities: { section: string; reason: string; priority: number }[];
      overall_readiness: number;
      headline: string;
    }>("/api/grant-optimizer/full-audit", {
      method: "POST",
      body: JSON.stringify({ api_online }),
    }),
  wsUrl: () => API.replace("http", "ws") + "/ws/events",
};
