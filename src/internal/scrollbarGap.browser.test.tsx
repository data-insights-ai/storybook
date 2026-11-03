import { afterEach, expect, test } from "vitest";
import { keepScrollbarGap } from "./scrollbarGap";

const root = document.documentElement;

afterEach(() => {
  root.style.removeProperty("--di-scrollbar-gap");
  root.style.removeProperty("overflow");
});

test("an open page records the width its scrollbar takes from the window", () => {
  keepScrollbarGap();
  expect(root.style.getPropertyValue("--di-scrollbar-gap")).toBe(`${window.innerWidth - root.clientWidth}px`);
});

test("a second overlay over a locked page keeps the gap the first one measured", () => {
  root.style.setProperty("--di-scrollbar-gap", "15px");
  root.style.overflow = "hidden";
  keepScrollbarGap();
  expect(root.style.getPropertyValue("--di-scrollbar-gap")).toBe("15px");
});
