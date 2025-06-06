import { useEffect, useRef } from "react";

// From https://usehooks.com/usePrevious/
export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  return ref.current;
}
