import { useEffect, useState } from "react";
import { cx } from "../cx";
import "./RouteProgress.css";

type Phase = "idle" | "running" | "done";

const crawlCeiling = 0.9;
const crawlStep = 0.12;
const crawlInterval = 240;
const settle = 420;

/**
 * The page is changing. A hairline fills along the bottom rule of the bar
 * while the next page loads, and runs out to the end when it arrives; the
 * rail, the bar and the page that is still showing stay where they are.
 *
 * Place it inside `AppShellBar`. It is positioned, not laid out, so it
 * moves nothing. A change that finishes inside `delay` never draws it.
 *
 * The length is not a count — a route change has none to give — so it
 * eases towards the end and never claims to arrive before it has.
 */
export function RouteProgress({
  active,
  label,
  delay = 150,
  className,
}: {
  /** True while the next page is loading. */
  active: boolean;
  /** What a screen reader hears, e.g. "Loading page". */
  label: string;
  /** Milliseconds before the line appears. */
  delay?: number;
  className?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (active) {
      const start = setTimeout(() => {
        setValue(0.2);
        setPhase("running");
      }, delay);
      return () => clearTimeout(start);
    }
    setPhase((current) => (current === "running" ? "done" : current));
  }, [active, delay]);

  useEffect(() => {
    if (phase === "running") {
      const crawl = setInterval(() => setValue((v) => v + (crawlCeiling - v) * crawlStep), crawlInterval);
      return () => clearInterval(crawl);
    }
    if (phase === "done") {
      setValue(1);
      const rest = setTimeout(() => setPhase("idle"), settle);
      return () => clearTimeout(rest);
    }
  }, [phase]);

  if (phase === "idle") return null;
  return (
    <div
      className={cx("di-route-progress", className)}
      data-phase={phase}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
    >
      <span className="di-route-progress-fill" style={{ transform: `scaleX(${value})` }} />
    </div>
  );
}
