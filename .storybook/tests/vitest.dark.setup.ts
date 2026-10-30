import { afterEach, beforeEach, expect } from "vitest";

// The root keeps its theme from the story before; every story has to set dark itself.
beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  expect(document.documentElement.dataset.theme).toBe("dark");
});
