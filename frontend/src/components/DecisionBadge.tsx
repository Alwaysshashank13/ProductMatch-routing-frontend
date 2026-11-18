import type { Decision } from "@/types/api";

export function DecisionBadge({ decision }: { decision: Decision }) {
  return <span className={`badge badge-${decision}`}>{decision}</span>;
}
