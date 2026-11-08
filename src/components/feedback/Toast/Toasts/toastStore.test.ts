import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { currentToast, dismissToast, holdToast, toast } from "./toastStore";

beforeEach(() => vi.useFakeTimers());

afterEach(() => {
  dismissToast();
  vi.useRealTimers();
});

describe("toast receipts", () => {
  it("leave after six seconds unless the reader holds the one shown", () => {
    toast({ title: "Saved." });
    const shown = currentToast()!;
    holdToast(shown.id, true);
    vi.advanceTimersByTime(10_000);
    expect(currentToast()?.title).toBe("Saved.");
    holdToast(shown.id, false);
    vi.advanceTimersByTime(6000);
    expect(currentToast()).toBeUndefined();
  });

  it("forget a hold when the receipt goes without the reader letting go", () => {
    toast({ title: "Saved." });
    holdToast(currentToast()!.id, true);
    dismissToast();
    toast({ title: "Sent." });
    vi.advanceTimersByTime(6000);
    expect(currentToast()).toBeUndefined();
  });

  it("ignore a hold for a receipt another replaced", () => {
    toast({ title: "Saved." });
    const first = currentToast()!.id;
    toast({ title: "Sent." });
    holdToast(first, true);
    vi.advanceTimersByTime(6000);
    expect(currentToast()).toBeUndefined();
  });
});
