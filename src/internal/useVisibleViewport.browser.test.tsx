import { useRef } from "react";
import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { useVisibleViewport } from "./useVisibleViewport";

let root: Root | undefined;
afterEach(() => {
  root?.unmount();
  document.body.innerHTML = "";
});

function Sheet({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useVisibleViewport(ref, open);
  return <div ref={ref} data-testid="sheet" />;
}

test("an open sheet follows the visible viewport and lets go when it closes", () => {
  const host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
  flushSync(() => root!.render(<Sheet open />));
  const sheet = host.querySelector<HTMLElement>("[data-testid=sheet]")!;
  const viewport = window.visualViewport!;
  expect(sheet.style.getPropertyValue("--di-visible-height")).toBe(`${viewport.height}px`);
  expect(sheet.style.getPropertyValue("--di-visible-top")).toBe(`${viewport.offsetTop}px`);
  flushSync(() => root!.render(<Sheet open={false} />));
  expect(sheet.style.getPropertyValue("--di-visible-height")).toBe("");
});
