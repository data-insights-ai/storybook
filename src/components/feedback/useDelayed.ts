import { useEffect, useState } from "react";

/** True once `delay` ms have passed since mount; a wait shorter than that never shows. */
export function useDelayed(delay: number) {
  const [elapsed, setElapsed] = useState(delay <= 0);
  useEffect(() => {
    if (delay <= 0) return;
    const timer = setTimeout(() => setElapsed(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return elapsed;
}
