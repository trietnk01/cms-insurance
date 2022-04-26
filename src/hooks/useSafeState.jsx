import { useState, useCallback, useEffect, useRef } from "react";

const useMounted = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};

export default function useSafeState(initialSate) {
  const [state, setState] = useState(initialSate);
  const mountedRef = useMounted();

  const safeSetState = useCallback(
    (updater) => {
      if (mountedRef.current) {
        setState(updater);
      }
    },
    [mountedRef]
  );

  return [state, safeSetState];
}
