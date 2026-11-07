import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { Dialog } from "./Dialog";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("the close button is its whole hit area, at least 24px, and leaves the head its inset", () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Dialog open title="New role" closeLabel="Close" onClose={() => {}}>
        <p>Body</p>
      </Dialog>,
    ),
  );
  const close = document.querySelector(".di-dialog-close")!.getBoundingClientRect();
  const icon = document.querySelector(".di-dialog-close > svg")!.getBoundingClientRect();
  const row = document.querySelector(".di-dialog-title-row")!.getBoundingClientRect();
  expect(close.width).toBeGreaterThanOrEqual(24);
  expect(close.height).toBeGreaterThanOrEqual(32);
  expect(Math.round(icon.right)).toBe(Math.round(row.right));
});
