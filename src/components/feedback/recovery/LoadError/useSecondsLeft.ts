import { useSyncExternalStore } from "react";

const second = () => Math.floor(Date.now() / 1000);

const everySecond = (onTick: () => void) => {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
};

const never = () => () => undefined;

export const secondsLeft = (at: Date | undefined, nowSecond: number) =>
  at ? Math.max(0, Math.ceil(at.getTime() / 1000) - nowSecond) : 0;

/**
 * Seconds until `at`, counting down once a second, 0 once it has passed.
 * The clock is read on every render, so an `at` that arrives later is
 * measured from now.
 */
export function useSecondsLeft(at: Date | undefined): number {
  const now = useSyncExternalStore(at ? everySecond : never, second, second);
  return secondsLeft(at, now);
}
