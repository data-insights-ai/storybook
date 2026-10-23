import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BAR_PX, bucketFor } from "../scale/resolution";
import { clampSpan, covers, sameSpan, widthOf, type Span } from "../scale/viewport";

// Long enough that a scroll or a pinch settles before the caller is asked to load again.
const SETTLE_MS = 350;
const HISTORY = 30;

export type TimelineNavigation = {
  /** Everything there is to see. */
  bounds: Span;
  /** What is in view right now, while the reader zooms and pans. */
  view: Span;
  /** The bucket width the bars of `view` should have, so each is about three pixels. */
  bucketMs: number;
  /** The bucket width for the overview, which always shows `bounds`. */
  overviewBucketMs: number;
  plotWidth: number;
  canGoBack: boolean;
  change: (next: Span, record: boolean) => void;
  back: () => void;
  measure: (plotWidth: number) => void;
};

/**
 * The view an `EventTimeline` shows, and the way back through it.
 *
 * `selected` is the view the caller stands for — a filter elsewhere on the
 * page, say — or `null` for all of `bounds`. When it changes, the view
 * follows. When the reader moves the view and it rests, `onSettle` reports
 * it, or `null` once it covers everything again. A view that only follows
 * `selected` is never reported back, so a selection wider than `bounds`
 * does not return as "everything".
 */
export function useTimelineView({
  bounds,
  selected,
  onSettle,
}: {
  bounds: Span;
  selected: Span | null;
  onSettle: (view: Span | null) => void;
}): TimelineNavigation {
  const target = useMemo(
    () => (selected ? clampSpan(selected, bounds) : bounds),
    [selected, bounds],
  );
  const [view, setView] = useState(target);
  const [past, setPast] = useState<Span[]>([]);
  const [synced, setSynced] = useState(target);
  const [sent, setSent] = useState(target);
  const [plotWidth, measure] = useState(0);

  const settle = useRef(onSettle);
  useLayoutEffect(() => {
    settle.current = onSettle;
  });

  const remember = (current: Span) => {
    const top = past.at(-1);
    if (!top || !sameSpan(top, current)) {
      setPast((p) => [...p, current].slice(-HISTORY));
    }
  };

  if (!sameSpan(target, synced)) {
    setSynced(target);
    setSent(target);
    if (!sameSpan(target, view)) {
      remember(view);
      setView(target);
    }
  }

  useEffect(() => {
    if (sameSpan(view, sent)) {
      return;
    }
    const timer = setTimeout(() => {
      const whole = covers(view, bounds);
      setSent(whole ? bounds : view);
      if (whole) {
        setView(bounds);
      }
      settle.current(whole ? null : view);
    }, SETTLE_MS);
    return () => clearTimeout(timer);
  }, [view, sent, bounds]);

  return {
    bounds,
    view,
    plotWidth,
    bucketMs: bucketFor(widthOf(view), plotWidth || BAR_PX),
    overviewBucketMs: bucketFor(widthOf(bounds), plotWidth || BAR_PX),
    canGoBack: past.length > 0,
    change: (next, record) => {
      if (record) {
        remember(view);
      }
      setView(clampSpan(next, bounds));
    },
    back: () => {
      setView(clampSpan(past.at(-1) ?? bounds, bounds));
      setPast((p) => p.slice(0, -1));
    },
    measure,
  };
}
