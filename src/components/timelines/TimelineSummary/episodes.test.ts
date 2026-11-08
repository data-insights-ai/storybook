import { describe, expect, it } from "vitest";
import type { TimelineBar, TimelineLane } from "../types";
import { episodesIn, episodesOf } from "./episodes";

const MIN = 60_000;
const bar = (minute: number, counts: Record<string, number> = { a: 1 }): TimelineBar => ({
  start: minute * MIN,
  end: (minute + 1) * MIN,
  counts,
});

describe("episodesOf", () => {
  it("has no episode without activity", () => {
    expect(episodesOf([])).toEqual([]);
    expect(episodesOf([bar(0, { a: 0 })])).toEqual([]);
  });

  it("splits at a quiet gap and keeps a short pause inside one episode", () => {
    const episodes = episodesOf([bar(0), bar(1), bar(2), bar(100), bar(101), bar(103)]);
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
    const bursts = [bar(20, { b: 40 }), bar(150, { b: 30 })];
    const episodes = episodesOf([...steady, ...bursts]);
    expect(episodes.map((e) => [e.start / MIN, e.end / MIN, e.kind])).toEqual([
      [0, 20, "steady"],
      [20, 21, "burst"],
      [21, 150, "steady"],
      [150, 151, "burst"],
      [151, 200, "steady"],
    ]);
    expect(episodes[1]).toMatchObject({ counts: { b: 40 }, total: 40 });
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

  it("counts what it holds per series", () => {
    const [episode] = episodesOf([bar(0, { a: 2 }), bar(1, { a: 1, b: 1 }), bar(2, { c: 2 })]);
    expect(episode).toMatchObject({ counts: { a: 3, b: 1, c: 2 }, total: 6 });
  });

  it("weighs every series alike when it looks for a burst", () => {
    const steady = Array.from({ length: 50 }, (_, m) => bar(m));
    const episodes = episodesOf([...steady.slice(0, 25), bar(25, { a: 1, b: 2 }), ...steady.slice(26)]);
    expect(episodes.map((e) => e.kind)).toEqual(["steady"]);
  });

  it("marks where each series fell inside it and leaves the quiet out", () => {
    const [episode] = episodesOf([
      bar(0),
      bar(1, { a: 1, b: 2 }),
      bar(2, { b: 1 }),
      bar(3),
      bar(4, { c: 1 }),
      bar(6, { b: 1 }),
    ]);
    expect(episode.stretches.map((s) => [s.start / MIN, s.end / MIN, s.series])).toEqual([
      [0, 2, "a"],
      [1, 3, "b"],
      [3, 4, "a"],
      [4, 5, "c"],
      [6, 7, "b"],
    ]);
  });

  it("names the lanes active in it, in the order they were given", () => {
    const lanes: TimelineLane[] = [
      {
        id: "a",
        label: "Access",
        cells: [{ start: 0, end: MIN, count: 2, series: "a" }],
      },
      {
        id: "b",
        label: "Movement",
        cells: [
          { start: MIN, end: 2 * MIN, count: 1, series: "b" },
          { start: 100 * MIN, end: 101 * MIN, count: 4, series: "a" },
        ],
      },
      { id: "c", label: "Unused", cells: [] },
    ];
    const episodes = episodesOf([bar(0), bar(1), bar(100)], lanes);
    expect(episodes[0].lanes).toEqual([
      { id: "a", label: "Access", count: 2 },
      { id: "b", label: "Movement", count: 1 },
    ]);
    expect(episodes[1].lanes).toEqual([{ id: "b", label: "Movement", count: 4 }]);
  });
});

describe("episodesIn", () => {
  it("counts the same episodes again from a filtered set and keeps their places", () => {
    const all = [bar(0), bar(1, { b: 2 }), bar(100), bar(200, { c: 1 })];
    const episodes = episodesOf(all);
    const onlyB = all.filter((b) => b.counts.b).map((b) => ({ ...b, counts: { b: b.counts.b } }));
    const again = episodesIn(episodes, onlyB);
    expect(again.map((e) => [e.start, e.end, e.kind])).toEqual(episodes.map((e) => [e.start, e.end, e.kind]));
    expect(again.map((e) => e.total)).toEqual([2, 0, 0]);
    expect(again[0].stretches.map((s) => s.series)).toEqual(["b"]);
  });
});
