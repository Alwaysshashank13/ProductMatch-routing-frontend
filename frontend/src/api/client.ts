import type { Decision, ExperimentInfo, Health, PairPage, RouterSummary } from "@/types/api";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function get<T>(path: string, params?: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => v !== undefined && query.set(k, String(v)));
  const res = await fetch(`${BASE}${path}${query.size ? `?${query}` : ""}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  return (await res.json()) as T;
}

export const api = {
  health: () => get<Health>("/health"),
  experiments: () => get<ExperimentInfo[]>("/experiments"),
  summary: (experiment: string) =>
    get<RouterSummary[]>(`/experiments/${encodeURIComponent(experiment)}/summary`),
  pairs: (experiment: string, router: string, decision?: Decision, limit = 100) =>
    get<PairPage>(`/experiments/${encodeURIComponent(experiment)}/pairs`, {
      router,
      decision,
      limit,
    }),
};
