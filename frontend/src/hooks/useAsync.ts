import { useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | undefined;
  error: string | undefined;
  loading: boolean;
}

/** Runs an async loader whenever its dependencies change; ignores stale responses. */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    error: undefined,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    loader()
      .then((data) => active && setState({ data, error: undefined, loading: false }))
      .catch((e: Error) => active && setState({ data: undefined, error: e.message, loading: false }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
