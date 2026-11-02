import { describe, expect, it } from "vitest";
import { fit, foldOrder, type FitInput } from "./fit";

const items = [
  { name: "search", width: 160, keep: true, priority: 0 },
  { name: "scope", width: 190, keep: false, priority: 0 },
  { name: "period", width: 220, keep: false, priority: 0 },
  { name: "quick", width: 300, keep: false, priority: 0 },
];

const base: FitInput = {
  room: 2000,
  gap: 8,
  items,
  trigger: 100,
  end: 32,
  triggerAlways: false,
  folded: [],
  phone: false,
  slack: 16,
};

// search + scope + period + quick + trigger? + end, gaps between them
const all = 160 + 190 + 220 + 300 + 32 + 8 * 4;

describe("fit", () => {
  it("keeps everything when it fits, without a trigger", () => {
    expect(fit({ ...base, room: all })).toEqual([]);
  });

  it("counts the trigger once it must show", () => {
    expect(fit({ ...base, room: all, triggerAlways: true })).toEqual(["quick"]);
  });

  it("folds from the last written item first", () => {
    expect(fit({ ...base, room: all - 1 })).toEqual(["quick"]);
    expect(fit({ ...base, room: 160 + 190 + 100 + 32 + 24 })).toEqual(["period", "quick"]);
    expect(fit({ ...base, room: 160 + 100 + 32 + 16 })).toEqual(["scope", "period", "quick"]);
  });

  it("never folds a kept item, even when nothing fits", () => {
    expect(fit({ ...base, room: 10 })).toEqual(["scope", "period", "quick"]);
  });

  it("follows priority before order", () => {
    const ranked = items.map((item) => (item.name === "quick" ? { ...item, priority: 2 } : item));
    expect(foldOrder(ranked).map((item) => item.name)).toEqual(["period", "scope", "quick"]);
    expect(fit({ ...base, items: ranked, room: 160 + 300 + 190 + 100 + 32 + 32 })).toEqual(["period"]);
  });

  it("keeps the phone bar to the kept items", () => {
    expect(fit({ ...base, phone: true })).toEqual(["scope", "period", "quick"]);
  });

  it("brings a folded item back only with room to spare", () => {
    const edge = 160 + 190 + 220 + 100 + 32 + 8 * 4;
    const tight = all;
    expect(fit({ ...base, room: tight, folded: ["quick"] })).toEqual(["quick"]);
    expect(fit({ ...base, room: tight + 16, folded: ["quick"] })).toEqual([]);
    expect(fit({ ...base, room: edge, folded: ["period", "quick"] })).toEqual(["period", "quick"]);
    expect(fit({ ...base, room: edge + 16, folded: ["period", "quick"] })).toEqual(["quick"]);
  });

  it("keeps the slack when what folded before is not where the fold order starts", () => {
    const ranked = items.map((item) => (item.name === "quick" ? { ...item, priority: 2 } : item));
    expect(fit({ ...base, items: ranked, room: all + 8, folded: ["quick"] })).toEqual(["period"]);
    expect(fit({ ...base, items: ranked, room: all + 16, folded: ["quick"] })).toEqual([]);
  });

  it("folds everything but the kept items on a phone, also with fields of its own", () => {
    expect(fit({ ...base, phone: true, triggerAlways: true })).toEqual(["scope", "period", "quick"]);
    const kept = items.map((item) => ({ ...item, keep: true }));
    expect(fit({ ...base, items: kept, phone: true, triggerAlways: true })).toEqual([]);
  });

  it("treats an item not yet measured as fitting, so it renders and is measured", () => {
    const fresh = [...items.slice(0, 3), { name: "new", width: 0, keep: false, priority: 0 }];
    expect(fit({ ...base, items: fresh, room: 160 + 190 + 220 + 32 + 32 })).toEqual([]);
  });
});
