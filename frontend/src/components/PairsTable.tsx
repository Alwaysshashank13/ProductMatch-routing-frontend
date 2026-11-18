import { DecisionBadge } from "@/components/DecisionBadge";
import { num } from "@/lib/format";
import type { Pair } from "@/types/api";

export function PairsTable({ pairs }: { pairs: Pair[] }) {
  if (!pairs.length) return <p className="muted">No pairs for this filter.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product A</th>
            <th>Product B</th>
            <th>Confidence</th>
            <th>Decision</th>
            <th>Ground truth</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p, i) => {
            const wrong =
              (p.decision === "approve" && p.label === 0) ||
              (p.decision === "block" && p.label === 1);
            return (
              <tr key={i} className={wrong ? "error-row" : undefined}>
                <td>{p.left_title}</td>
                <td>{p.right_title}</td>
                <td className="mono">{num(p.confidence)}</td>
                <td>
                  <DecisionBadge decision={p.decision} />
                </td>
                <td>{p.label === 1 ? "match" : "not a match"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
