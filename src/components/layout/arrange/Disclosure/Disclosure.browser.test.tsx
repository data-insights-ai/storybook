import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles/styles.css";
import { Disclosure } from "./Disclosure";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("a long value inside a folded disclosure does not widen what holds it", () => {
  const host = document.createElement("div");
  host.style.width = "300px";
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <Disclosure title="Technical details">
        <div style={{ display: "flex" }}>
          <span style={{ whiteSpace: "nowrap" }}>
            an-identifier-far-longer-than-the-disclosure-that-holds-it-and-the-page
          </span>
        </div>
      </Disclosure>,
    ),
  );
  const held = host.querySelector(".di-disclosure")!.getBoundingClientRect().right;
  const clip = host.querySelector(".di-disclosure-clip")!.getBoundingClientRect().right;
  expect(clip).toBeLessThanOrEqual(held + 8);
});
