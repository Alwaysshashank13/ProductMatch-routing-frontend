import { useEffect, useState } from "react";

import { api } from "@/api/client";
import { ApiStatus } from "@/components/ApiStatus";
import { KpiCards } from "@/components/KpiCards";
import { PairsTable } from "@/components/PairsTable";
import { RouterTable } from "@/components/RouterTable";
import { useAsync } from "@/hooks/useAsync";
import type { Decision } from "@/types/api";

export function DashboardPage() {
  const health = useAsync(api.health, []);
  const apiDown = !health.loading && !!health.error;
  const experiments = useAsync(api.experiments, []);
  const [experiment, setExperiment] = useState<string>("");
  const [router, setRouter] = useState("cost_empirical");
  const [decision, setDecision] = useState<Decision | "">("");

  useEffect(() => {
    if (!experiment && experiments.data?.length) setExperiment(experiments.data[0].name);
  }, [experiments.data, experiment]);

  const summary = useAsync(
    () => (experiment ? api.summary(experiment) : Promise.resolve([])),
    [experiment],
  );
  const pairs = useAsync(
    () =>
      experiment
        ? api.pairs(experiment, router, decision || undefined)
        : Promise.resolve({ total: 0, items: [] }),
    [experiment, router, decision],
  );

  const error = experiments.error ?? summary.error ?? pairs.error;
  const selectedRow = summary.data?.find((r) => r.router === router);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>ProductMatch Routing</h1>
          <p className="muted">When can an AI product match update data on its own?</p>
        </div>
        <div className="header-actions">
          <ApiStatus health={health.data} error={health.error} loading={health.loading} />
          <label className="field">
            Experiment
            <select value={experiment} onChange={(e) => setExperiment(e.target.value)}>
              {experiments.data?.map((e) => (
                <option key={e.name} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {apiDown && (
        <div className="alert">
          Cannot reach the API. Start the backend with <code>make api</code>, then refresh this
          page.
        </div>
      )}
      {!apiDown && error && <div className="alert">{error}</div>}
      {!apiDown && !experiments.loading && !experiments.error && !experiments.data?.length && (
        <div className="alert">
          No experiments yet. Run <code>make run</code> to create one.
        </div>
      )}

      <section>
        <h2>
          Selected router: <span className="mono">{router}</span>
        </h2>
        <KpiCards row={selectedRow} />
      </section>

      <section className="card">
        <h2>Router comparison</h2>
        <p className="muted small">Test set, averaged across seeds. Click a row to inspect it.</p>
        <RouterTable rows={summary.data ?? []} selected={router} onSelect={setRouter} />
      </section>

      <section className="card">
        <div className="section-head">
          <h2>Routing decisions</h2>
          <label className="field">
            Decision
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as Decision | "")}
            >
              <option value="">All</option>
              <option value="approve">Approve</option>
              <option value="review">Review</option>
              <option value="block">Block</option>
            </select>
          </label>
        </div>
        <p className="muted small">
          Showing {pairs.data?.items.length ?? 0} of {pairs.data?.total ?? 0}. Rows in red are
          wrong automatic decisions.
        </p>
        <PairsTable pairs={pairs.data?.items ?? []} />
      </section>
    </main>
  );
}
