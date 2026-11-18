import { num, pct } from "@/lib/format";
import type { RouterSummary } from "@/types/api";

interface Props {
  rows: RouterSummary[];
  selected: string;
  onSelect: (router: string) => void;
}

export function RouterTable({ rows, selected, onSelect }: Props) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Router</th>
            <th>Thresholds (block / approve)</th>
            <th>Automated</th>
            <th>Unsafe updates</th>
            <th>Review workload</th>
            <th>Missed matches</th>
            <th>Cost per pair</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.router}
              className={r.router === selected ? "clickable selected" : "clickable"}
              onClick={() => onSelect(r.router)}
            >
              <td className="mono">{r.router}</td>
              <td>
                {num(r.threshold_low, 2)} / {num(r.threshold_high, 2)}
              </td>
              <td>{pct(r.automation_rate)}</td>
              <td>{pct(r.unsafe_update_rate)}</td>
              <td>{pct(r.review_rate)}</td>
              <td>{pct(r.missed_match_rate)}</td>
              <td>{num(r.cost_per_pair)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
