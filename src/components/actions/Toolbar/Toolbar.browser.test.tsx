import { afterEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../styles/styles.css";
import { Dialog } from "../../overlays/Dialog";
import { Button } from "../Button";
import { Toolbar } from "./Toolbar";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

test("a dialog an action opens inside a toolbar keeps to a phone's width and leaves the buttons alone", async () => {
  await page.viewport(390, 800);
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  const toolbar = (dialog: boolean) => (
    <Toolbar align="end">
      <Button variant="secondary">Add</Button>
      <Button>Open</Button>
      {dialog && (
        <Dialog open placement="center" title="Choose" onClose={() => undefined}>
          <p style={{ whiteSpace: "nowrap" }}>
            A line far longer than a phone is wide, which no dialog may take as its own width
          </p>
        </Dialog>
      )}
    </Toolbar>
  );
  flushSync(() => root!.render(toolbar(false)));
  const before = host.querySelector(".di-btn-primary")!.getBoundingClientRect().top;
  flushSync(() => root!.render(toolbar(true)));

  expect(document.querySelector("dialog")!.getBoundingClientRect().width).toBeLessThanOrEqual(390);
  expect(host.querySelector(".di-btn-primary")!.getBoundingClientRect().top).toBe(before);
});
