import { useEffect, useState } from "react";

const secondsUntil = (at: Date | undefined, now: number) =>
  at ? Math.max(0, Math.ceil((at.getTime() - now) / 1000)) : 0;

/** Seconds until `at`, counting down once a second, 0 once it has passed. */
export function useSecondsLeft(at: Date | undefined): number {
  const [now, setNow] = useState(() => Date.now());
  const left = secondsUntil(at, now);
  useEffect(() => {
    if (left === 0) return;
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [left, now]);
  return left;
}
