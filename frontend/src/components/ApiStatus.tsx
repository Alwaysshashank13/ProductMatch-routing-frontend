import type { Health } from "@/types/api";

interface Props {
  health: Health | undefined;
  error: string | undefined;
  loading: boolean;
}

/** Shows whether the dashboard can reach the backend API. */
export function ApiStatus({ health, error, loading }: Props) {
  const state = loading ? "checking" : error ? "down" : "ok";
  const label =
    state === "checking"
      ? "Connecting to API..."
      : state === "down"
        ? "API offline"
        : `API connected · v${health?.version}`;
  return (
    <span className={`status status-${state}`} role="status">
      <span className="status-dot" />
      {label}
    </span>
  );
}
