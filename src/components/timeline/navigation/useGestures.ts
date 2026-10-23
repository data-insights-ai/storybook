import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { clampSpan, panBy, scaleOf, widthOf, zoomAround, type Span } from "../scale/viewport";

// A finger has to travel this far, and more sideways than down, before it pans instead of scrolling.
const TOUCH_SLOP = 8;
const MOUSE_SLOP = 3;
// Wheel events closer together than this are one gesture, and one step back.
const GESTURE_GAP = 400;

type Gesture =
  | { kind: "press"; x: number; y: number; touch: boolean }
  | { kind: "brush"; from: number }
  | { kind: "pan"; last: number }
  | { kind: "pinch"; ids: [number, number]; times: [number, number] };

export type ViewChange = (next: Span, record: boolean) => void;

type Options = {
  view: Span;
  bounds: Span;
  plotPx: number;
  onView: ViewChange;
  onPick: (px: number) => void;
};

export function useGestures<T extends HTMLElement>(options: Options) {
  // A callback ref, so the wheel listener follows the element when it mounts after the first measurement.
  const [element, setElement] = useState<T | null>(null);
  const latest = useRef(options);
  useLayoutEffect(() => {
    latest.current = options;
  });
  const [hover, setHover] = useState<number | null>(null);
  const [brush, setBrush] = useState<{ from: number; to: number } | null>(null);
  const pointers = useRef(new Map<number, number>());
  const gesture = useRef<Gesture | null>(null);
  const lastWheel = useRef(0);

  const xOf = (clientX: number) => clientX - (element?.getBoundingClientRect().left ?? 0);

  // React listens to wheel passively; zooming has to keep the page from scrolling along.
  useEffect(() => {
    if (!element) {
      return;
    }
    const left = () => element.getBoundingClientRect().left;
    const onWheel = (event: WheelEvent) => {
      const { view, bounds, plotPx, onView } = latest.current;
      const zoom = event.ctrlKey || event.metaKey;
      const sideways = event.shiftKey
        ? event.deltaY
        : Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : 0;
      if (!zoom && !sideways) {
        return;
      }
      event.preventDefault();
      const record = event.timeStamp - lastWheel.current > GESTURE_GAP;
      lastWheel.current = event.timeStamp;
      const scale = scaleOf(view, plotPx);
      if (zoom) {
        const factor = Math.min(2, Math.max(0.5, Math.exp(event.deltaY * 0.01)));
        onView(zoomAround(view, scale.at(event.clientX - left()), factor, bounds), record);
      } else {
        onView(panBy(view, (sideways * widthOf(view)) / plotPx, bounds), record);
      }
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [element]);

  const onPointerDown = (event: PointerEvent<T>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = xOf(event.clientX);
    pointers.current.set(event.pointerId, x);
    if (pointers.current.size === 2) {
      const [[a, xa], [b, xb]] = [...pointers.current];
      const scale = scaleOf(latest.current.view, latest.current.plotPx);
      gesture.current = { kind: "pinch", ids: [a, b], times: [scale.at(xa), scale.at(xb)] };
      latest.current.onView(latest.current.view, true);
      setBrush(null);
    } else if (pointers.current.size === 1) {
      gesture.current = {
        kind: "press",
        x,
        y: event.clientY,
        touch: event.pointerType !== "mouse",
      };
    }
  };

  const onPointerMove = (event: PointerEvent<T>) => {
    const x = xOf(event.clientX);
    if (event.pointerType === "mouse") {
      setHover(x);
    }
    if (!pointers.current.has(event.pointerId)) {
      return;
    }
    pointers.current.set(event.pointerId, x);
    const { view, bounds, plotPx, onView } = latest.current;
    const g = gesture.current;
    if (g?.kind === "press") {
      const dx = Math.abs(x - g.x);
      if (g.touch && dx > TOUCH_SLOP && dx > Math.abs(event.clientY - g.y)) {
        gesture.current = { kind: "pan", last: x };
        onView(view, true);
      } else if (!g.touch && dx > MOUSE_SLOP) {
        gesture.current = { kind: "brush", from: g.x };
        setBrush({ from: g.x, to: x });
      }
    } else if (g?.kind === "brush") {
      setBrush({ from: g.from, to: Math.min(plotPx, Math.max(0, x)) });
    } else if (g?.kind === "pan") {
      onView(panBy(view, ((g.last - x) * widthOf(view)) / plotPx, bounds), false);
      gesture.current = { kind: "pan", last: x };
    } else if (g?.kind === "pinch") {
      // The two instants under the fingers stay under them, wherever the fingers go.
      const xa = pointers.current.get(g.ids[0]);
      const xb = pointers.current.get(g.ids[1]);
      if (xa === undefined || xb === undefined || Math.abs(xb - xa) < 16) {
        return;
      }
      const width = ((g.times[1] - g.times[0]) * plotPx) / (xb - xa);
      const start = g.times[0] - (xa / plotPx) * width;
      onView(clampSpan({ start, end: start + width }, bounds), false);
    }
  };

  const end = (event: PointerEvent<T>, cancelled: boolean) => {
    pointers.current.delete(event.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0 && g?.kind === "pinch") {
      gesture.current = null;
      return;
    }
    gesture.current = null;
    setBrush(null);
    if (cancelled) {
      return;
    }
    const { view, plotPx, onView, onPick } = latest.current;
    if (g?.kind === "brush") {
      const lo = Math.min(g.from, xOf(event.clientX));
      const hi = Math.max(g.from, xOf(event.clientX));
      if (hi - lo >= 4) {
        const scale = scaleOf(view, plotPx);
        onView({ start: scale.at(Math.max(0, lo)), end: scale.at(Math.min(plotPx, hi)) }, true);
      }
    } else if (g?.kind === "press") {
      onPick(xOf(event.clientX));
    }
  };

  const onDoubleClick = (event: { clientX: number }) => {
    const { view, bounds, plotPx, onView } = latest.current;
    onView(zoomAround(view, scaleOf(view, plotPx).at(xOf(event.clientX)), 2, bounds), true);
  };

  const onKeyDown = (event: KeyboardEvent<T>) => {
    const { view, bounds, onView } = latest.current;
    const centre = (view.start + view.end) / 2;
    const step = widthOf(view) * (event.shiftKey ? 0.5 : 0.1);
    const next: Record<string, () => Span> = {
      ArrowLeft: () => panBy(view, -step, bounds),
      ArrowRight: () => panBy(view, step, bounds),
      "+": () => zoomAround(view, centre, 0.5, bounds),
      "=": () => zoomAround(view, centre, 0.5, bounds),
      "-": () => zoomAround(view, centre, 2, bounds),
      "0": () => bounds,
      Home: () => bounds,
    };
    const move = next[event.key];
    if (move) {
      event.preventDefault();
      onView(move(), true);
    }
  };

  return {
    ref: setElement,
    hover,
    brush,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (event: PointerEvent<T>) => end(event, false),
      onPointerCancel: (event: PointerEvent<T>) => end(event, true),
      onPointerLeave: (event: PointerEvent<T>) => event.pointerType === "mouse" && setHover(null),
      onDoubleClick,
      onKeyDown,
    },
  };
}
