import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { Progress } from "./Progress";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test.each(["340px", "240px"])("a long count takes the next line instead of squeezing the label: %s", (width) => {
  const host = document.createElement("div");
  host.style.width = width;
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Progress
        id="analysed"
        label="Analysed by the core"
        count="213,639,301 of 213,639,301 records (100 %)"
        value={1}
        max={1}
      />,
    ),
  );
  const label = host.querySelector(".di-progress-label")!.getBoundingClientRect();
  const count = host.querySelector(".di-progress-count")!.getBoundingClientRect();
  expect(label.height).toBeLessThan(30);
  expect(count.top).toBeGreaterThanOrEqual(label.bottom - 1);
  expect(count.right).toBeLessThanOrEqual(host.getBoundingClientRect().right);
});
