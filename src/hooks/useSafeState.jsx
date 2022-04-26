import { useState, useCallback, useEffect, useRef } from "react";
const useMounted = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    console.log("useMounted - useEffect");
    mountedRef.current = true;
    return () => {
      console.log("useMounted - cleanUp");
      mountedRef.current = false;
    };
  }, []);
  console.log("useMounted");
  return mountedRef;
};

export default function useSafeState(initialSate) {
  const [state, setState] = useState(initialSate);
  const mountedRef = useMounted();
  const safeSetState = useCallback(
    (updater) => {
      console.log("useCallback");
      if (mountedRef.current) {
        setState(updater);
      }
    },
    [mountedRef]
  );
  console.log("useSafeState");
  return [state, safeSetState];
}
