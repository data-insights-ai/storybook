import { describe, expect, it } from "vitest";
import { secondsLeft } from "./useSecondsLeft";

describe("secondsLeft", () => {
  it("counts whole seconds to the wait's end, and nothing once it passed", () => {
    const now = Date.parse("2026-11-08T10:10:00Z") / 1000;
    expect(secondsLeft(undefined, now)).toBe(0);
    expect(secondsLeft(new Date("2026-11-08T10:10:30Z"), now)).toBe(30);
    expect(secondsLeft(new Date("2026-11-08T10:10:29.200Z"), now)).toBe(30);
    expect(secondsLeft(new Date("2026-11-08T10:09:00Z"), now)).toBe(0);
  });
});
