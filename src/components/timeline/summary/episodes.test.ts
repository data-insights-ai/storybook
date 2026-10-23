import { describe, expect, it } from "vitest";
import type { TimelineBar, TimelineLane } from "../types";
import { episodesOf } from "./episodes";

const MIN = 60_000;
const bar = (
  minute: number,
  counts: Partial<TimelineBar> = {},
): TimelineBar => ({
  start: minute * MIN,
  end: (minute + 1) * MIN,
  neutral: 1,
  warn: 0,
  danger: 0,
  ...counts,
});

describe("episodesOf", () => {
  it("has no episode without activity", () => {
    expect(episodesOf([])).toEqual([]);
    expect(episodesOf([bar(0, { neutral: 0 })])).toEqual([]);
  });

  it("splits at a quiet gap and keeps a short pause inside one episode", () => {
    const episodes = episodesOf([
      bar(0),
      bar(1),
      bar(2),
      bar(100),
      bar(101),
      bar(103),
    ]);
    expect(episodes.map((e) => [e.start / MIN, e.end / MIN])).toEqual([
      [0, 3],
      [100, 104],
    ]);
  });

  it("splits only at the longest gaps once there are more than it may show", () => {
    const bars = [0, 100, 150, 400, 420].map((m) => bar(m));
    const episodes = episodesOf(bars, [], 3);
    expect(episodes.map((e) => e.start / MIN)).toEqual([0, 100, 400]);
    expect(episodes.map((e) => e.total)).toEqual([1, 2, 2]);
  });

  it("tells bursts from the steady activity between them", () => {
    const steady = Array.from({ length: 200 }, (_, m) => m)
      .filter((m) => m !== 20 && m !== 150)
      .map((m) => bar(m));
    const bursts = [
      bar(20, { neutral: 0, danger: 40 }),
      bar(150, { neutral: 0, danger: 30 }),
    ];
    const episodes = episodesOf([...steady, ...bursts]);
    expect(episodes.map((e) => [e.start / MIN, e.end / MIN, e.kind])).toEqual([
      [0, 20, "steady"],
      [20, 21, "burst"],
      [21, 150, "steady"],
      [150, 151, "burst"],
      [151, 200, "steady"],
    ]);
    expect(episodes[1]).toMatchObject({ danger: 40, total: 40 });
  });

  it("calls even activity steady, and leaves out a steady stretch too small to matter", () => {
    const even = Array.from({ length: 100 }, (_, m) => bar(m));
    const episodes = episodesOf([...even, bar(5000)]);
    expect(episodes).toHaveLength(1);
    expect(episodes[0]).toMatchObject({
      start: 0,
      end: 100 * MIN,
      kind: "steady",
      total: 100,
    });
  });

  it("takes the severest tone it holds", () => {
    const [episode] = episodesOf([
      bar(0),
      bar(1, { warn: 3 }),
      bar(2, { danger: 1 }),
    ]);
    expect(episode).toMatchObject({
      neutral: 3,
      warn: 3,
      danger: 1,
      total: 7,
      tone: "danger",
    });
  });

  it("marks each stretch inside it in its severest tone and leaves the quiet out", () => {
    const [episode] = episodesOf([
      bar(0),
      bar(1, { danger: 2 }),
      bar(2, { danger: 1 }),
      bar(3),
      bar(4, { warn: 1 }),
      bar(6, { danger: 1 }),
    ]);
    expect(
      episode.stretches.map((s) => [s.start / MIN, s.end / MIN, s.tone]),
    ).toEqual([
      [0, 1, "neutral"],
      [1, 3, "danger"],
      [3, 4, "neutral"],
      [4, 5, "warn"],
      [6, 7, "danger"],
    ]);
  });

  it("names the lanes active in it, in the order they were given", () => {
    const lanes: TimelineLane[] = [
      {
        id: "a",
        label: "Access",
        cells: [{ start: 0, end: MIN, count: 2, tone: "warn" }],
      },
      {
        id: "b",
        label: "Movement",
        cells: [
          { start: MIN, end: 2 * MIN, count: 1, tone: "danger" },
          { start: 100 * MIN, end: 101 * MIN, count: 4, tone: "neutral" },
        ],
      },
      { id: "c", label: "Unused", cells: [] },
    ];
    const episodes = episodesOf([bar(0), bar(1), bar(100)], lanes);
    expect(episodes[0].lanes).toEqual([
      { id: "a", label: "Access", count: 2, tone: "warn" },
      { id: "b", label: "Movement", count: 1, tone: "danger" },
    ]);
    expect(episodes[1].lanes).toEqual([
      { id: "b", label: "Movement", count: 4, tone: "neutral" },
    ]);
  });
});
