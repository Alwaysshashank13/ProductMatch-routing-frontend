import { pct } from "@/lib/format";
import type { RouterSummary } from "@/types/api";

interface Props {
  row: RouterSummary | undefined;
}

export function KpiCards({ row }: Props) {
  if (!row) return null;
  const kpis = [
    { label: "Automated", value: pct(row.automation_rate), hint: "handled without a human" },
    { label: "Unsafe updates", value: pct(row.unsafe_update_rate), hint: "of auto-approved" },
    { label: "Review workload", value: pct(row.review_rate), hint: "sent to a human" },
    { label: "Missed matches", value: pct(row.missed_match_rate), hint: "true matches blocked" },
  ];
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <div className="card kpi" key={k.label}>
          <span className="kpi-label">{k.label}</span>
          <span className="kpi-value">{k.value}</span>
          <span className="kpi-hint">{k.hint}</span>
        </div>
      ))}
    </div>
  );
}
