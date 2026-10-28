import { afterEach, expect, test } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../styles.css";
import { Notice, NoticeText, NoticeTitle } from "./Notice";
import { ToastRegion } from "./Toast";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("what the region holds gets a readable width, even without one of its own", () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <ToastRegion>
        <Notice tone="warn">
          <NoticeText>
            <NoticeTitle>Your change could not be saved.</NoticeTitle>
          </NoticeText>
        </Notice>
      </ToastRegion>,
    ),
  );
  const notice = document.querySelector(".di-notice")!.getBoundingClientRect();
  expect(notice.width).toBeGreaterThanOrEqual(Math.min(320, window.innerWidth - 32));
  expect(notice.width).toBeLessThanOrEqual(480);
  expect(notice.right).toBeLessThanOrEqual(window.innerWidth);
});
