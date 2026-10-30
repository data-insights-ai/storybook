import { afterEach, expect } from "vitest";

afterEach(() => {
  expect(document.documentElement.dataset.theme).toBe("dark");
});
