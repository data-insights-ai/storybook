import type {
  TimelineBar,
  TimelineCell,
  TimelineEvent,
  TimelineLane,
  TimelineSpan,
  TimelineTone,
} from "../components/timeline/types";
import { boundsAround } from "../components/timeline/scale/viewport";

/*
 * Invented activity for the EventTimeline stories. A product loads bars from
 * its own server, folded at the bucket width the timeline asks for; the
 * stories fold these in the browser instead.
 */

const HOUR = 3_600_000;

export type SampleEvent = TimelineEvent & { text: string };

type Phase = {
  lane: string;
  count: number;
  startH: number;
  durationH: number;
  tones: [TimelineTone, number][];
  text: (i: number) => string;
  rhythm?: { bursts: number; spreadS: number } | { everyS: number; jitterS: number };
};

function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generate(start: number, phases: Phase[], seed: number): SampleEvent[] {
  const rnd = random(seed);
  const events: SampleEvent[] = [];
  for (const phase of phases) {
    const from = start + phase.startH * HOUR;
    const span = phase.durationH * HOUR;
    const rhythm = phase.rhythm;
    const waves =
      rhythm && "bursts" in rhythm
        ? Array.from({ length: rhythm.bursts }, () => from + rnd() * span)
        : [];
    for (let i = 0; i < phase.count; i++) {
      const at =
        rhythm && "everyS" in rhythm
          ? from + i * rhythm.everyS * 1000 + (rnd() - 0.5) * 2 * rhythm.jitterS * 1000
          : rhythm && "bursts" in rhythm
            ? Math.min(
                from + span,
                waves[Math.floor(rnd() * waves.length)] -
                  Math.log(1 - rnd()) * rhythm.spreadS * 1000,
              )
            : from + Math.pow(rnd(), 1.6) * span;
      let roll = rnd() * phase.tones.reduce((n, [, w]) => n + w, 0);
      const tone = phase.tones.find(([, w]) => (roll -= w) <= 0)?.[0] ?? "neutral";
      const base = tone === "danger" ? 0.65 : tone === "warn" ? 0.4 : 0.15;
      events.push({
        id: `${phase.lane}-${i}`,
        at: Math.round(at),
        magnitude: base + rnd() * 0.3,
        tone,
        lane: phase.lane,
        text: phase.text(i),
      });
    }
  }
  return events.sort((a, b) => a.at - b.at);
}

const host = (i: number) => `host-${String((i % 36) + 1).padStart(2, "0")}`;

export const intrusionLanes: TimelineLane[] = [
  { id: "recon", label: "Reconnaissance" },
  { id: "access", label: "Initial access" },
  { id: "credentials", label: "Credential access" },
  { id: "lateral", label: "Lateral movement" },
  { id: "exfil", label: "Exfiltration" },
];

/** Three days of an invented intrusion, with a spray of hundreds of logons inside minutes. */
export function intrusion(end: number): SampleEvent[] {
  return generate(
    end - 72 * HOUR,
    [
      {
        lane: "recon",
        count: 14,
        startH: 0,
        durationH: 9,
        tones: [
          ["warn", 3],
          ["danger", 1],
        ],
        text: () => "Address listed in a credential dump",
      },
      {
        lane: "credentials",
        count: 60,
        startH: 8,
        durationH: 6,
        tones: [
          ["neutral", 3],
          ["warn", 2],
        ],
        text: (i) => `Failed sign-in on the gateway for user-${i % 5}`,
      },
      {
        lane: "access",
        count: 18,
        startH: 14,
        durationH: 3,
        tones: [
          ["danger", 3],
          ["warn", 1],
        ],
        text: () => "Sign-in from an address never seen for this account",
      },
      {
        lane: "lateral",
        count: 160,
        startH: 20,
        durationH: 30,
        tones: [
          ["danger", 3],
          ["warn", 1],
        ],
        text: (i) => `Remote logon to ${host(i)}`,
      },
      {
        lane: "lateral",
        count: 420,
        startH: 40,
        durationH: 0.3,
        rhythm: { bursts: 3, spreadS: 45 },
        tones: [
          ["danger", 5],
          ["warn", 2],
        ],
        text: (i) => `Admin-share logon to ${host(i)}, one of dozens within seconds`,
      },
      {
        lane: "exfil",
        count: 180,
        startH: 66,
        durationH: 0.4,
        rhythm: { bursts: 5, spreadS: 20 },
        tones: [["danger", 3]],
        text: () => "Chunked upload to external storage",
      },
    ],
    2041,
  );
}

/** Twelve hours of a 60-second rhythm, which only shows as a rhythm close up. */
export function rhythm(end: number): SampleEvent[] {
  return generate(
    end - 12 * HOUR,
    [
      {
        lane: "c2",
        count: 720,
        startH: 0,
        durationH: 12,
        rhythm: { everyS: 60, jitterS: 2 },
        tones: [
          ["neutral", 6],
          ["warn", 1],
        ],
        text: () => "HTTPS request to the same address, every minute",
      },
    ],
    2044,
  );
}

/** A handful, spread over a day: few enough to draw one by one at once. */
export function sparse(end: number): SampleEvent[] {
  return generate(
    end - 30 * HOUR,
    [
      {
        lane: "recon",
        count: 9,
        startH: 0,
        durationH: 30,
        tones: [
          ["neutral", 2],
          ["warn", 1],
          ["danger", 1],
        ],
        text: () => "Domain named on a forum",
      },
    ],
    2017,
  );
}

export const boundsOf = (events: SampleEvent[]): TimelineSpan =>
  boundsAround(events[0]?.at ?? 0, events.at(-1)?.at ?? 0);

/** What a server returns for a window: buckets from `start`, stepping by `bucketMs`. */
export function foldBars(
  events: SampleEvent[],
  span: TimelineSpan,
  bucketMs: number,
): TimelineBar[] {
  const from = Math.floor(span.start / bucketMs) * bucketMs;
  const bars = new Map<number, TimelineBar>();
  for (const e of events) {
    if (e.at < from || e.at >= span.end) continue;
    const start = Math.floor(e.at / bucketMs) * bucketMs;
    const bar = bars.get(start) ?? { start, end: start + bucketMs, neutral: 0, warn: 0, danger: 0 };
    bar[e.tone] += 1;
    bars.set(start, bar);
  }
  return [...bars.values()].sort((a, b) => a.start - b.start);
}

const rank: Record<TimelineTone, number> = { neutral: 0, warn: 1, danger: 2 };

export function foldLanes(
  lanes: TimelineLane[],
  events: SampleEvent[],
  span: TimelineSpan,
  bucketMs: number,
): TimelineLane[] {
  return lanes.map((lane) => {
    const cells = new Map<number, TimelineCell>();
    for (const e of events) {
      if (e.lane !== lane.id || e.at < span.start || e.at >= span.end) continue;
      const start = Math.floor(e.at / bucketMs) * bucketMs;
      const cell = cells.get(start) ?? { start, end: start + bucketMs, count: 0, tone: e.tone };
      cell.count += 1;
      if (rank[e.tone] > rank[cell.tone]) cell.tone = e.tone;
      cells.set(start, cell);
    }
    return { ...lane, cells: [...cells.values()] };
  });
}
