import { textWidth } from "./labels";
import { widthOf, type Span } from "./viewport";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const STEPS = [
  SECOND,
  2 * SECOND,
  5 * SECOND,
  10 * SECOND,
  15 * SECOND,
  30 * SECOND,
  MINUTE,
  2 * MINUTE,
  5 * MINUTE,
  10 * MINUTE,
  15 * MINUTE,
  30 * MINUTE,
  HOUR,
  2 * HOUR,
  3 * HOUR,
  6 * HOUR,
  12 * HOUR,
  DAY,
  2 * DAY,
  7 * DAY,
];

export const TICK_FONT = 11;
const LABEL_GAP = 28;

export type TickKind = "day" | "time" | "second";
export type Tick = { at: number; kind: TickKind };

// Milliseconds the zone is ahead of UTC at that instant, so ticks land on the reader's round hours.
export function zoneOffset(timeZone: string): (ms: number) => number {
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return (ms) => {
    const part = Object.fromEntries(format.formatToParts(ms).map((p) => [p.type, Number(p.value)]));
    const wall = Date.UTC(part.year, part.month - 1, part.day, part.hour, part.minute, part.second);
    return wall - Math.floor(ms / SECOND) * SECOND;
  };
}

// Seconds need hh:mm:ss; anything coarser fits hh:mm or a short date in the same width.
const labelChars = (step: number) => (step < MINUTE ? 8 : 6);

// Aligned with the offset at the view's start: a daylight-saving switch inside one view
// shifts its ticks by an hour.
export function ticksFor(span: Span, plotPx: number, offsetOf: (ms: number) => number): Tick[] {
  const msPerPx = widthOf(span) / Math.max(1, plotPx);
  const step =
    STEPS.find((s) => s / msPerPx >= textWidth("0".repeat(labelChars(s)), TICK_FONT) + LABEL_GAP) ??
    7 * DAY;
  const offset = offsetOf(span.start);
  const ticks: Tick[] = [];
  for (
    let at = Math.ceil((span.start + offset) / step) * step - offset;
    at <= span.end;
    at += step
  ) {
    const local = at + offsetOf(at);
    const kind: TickKind = local % DAY === 0 ? "day" : step < MINUTE ? "second" : "time";
    ticks.push({ at, kind });
  }
  return ticks;
}

/** Dates and times in the reader's language and zone; the component ships no words of its own. */
export function clockFormats(locale: string, timeZone: string) {
  const make = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { hourCycle: "h23", timeZone, ...options });
  const day = make({ day: "numeric", month: "short" });
  const time = make({ hour: "2-digit", minute: "2-digit" });
  const clock = make({ hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return {
    tick: (tick: Tick) =>
      (tick.kind === "day" ? day : tick.kind === "second" ? clock : time).format(tick.at),
    offsetOf: zoneOffset(timeZone),
  };
}
