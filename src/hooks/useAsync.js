import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function and tracks loading / error / data state.
 * Centralising this keeps every page's loading and error handling consistent.
 *
 * @param {() => Promise<any>} asyncFn
 * @param {any[]} deps  Re-run when these change.
 */
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(() => {
    setState({ data: null, loading: true, error: null });
    asyncFn()
      .then((data) => {
        if (mounted.current) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (mounted.current) setState({ data: null, loading: false, error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, retry: run };
}
