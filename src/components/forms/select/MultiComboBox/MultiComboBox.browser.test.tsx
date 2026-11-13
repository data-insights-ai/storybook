import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import "../../../../styles/styles.css";
import { MultiComboBox } from "./MultiComboBox";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

// A dialog focuses its first field: a list that opened on focus alone would cover the fields under it, as a
// ComboBox's does not.
test("focus alone opens no list; the toggle does", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() =>
    root!.render(
      <MultiComboBox
        id="roles"
        label="Role"
        toggleLabel="Show roles"
        removeLabel={(label) => `Remove ${label}`}
        values={[]}
        onChange={() => {}}
        options={[
          { value: "actor", label: "Actor" },
          { value: "target", label: "Target" },
        ]}
      />,
    ),
  );
  flushSync(() => host.querySelector<HTMLInputElement>("input")!.focus());
  expect(document.querySelector("[role=listbox]")).toBeNull();

  await userEvent.click(host.querySelector<HTMLButtonElement>("button[aria-label='Show roles']")!);
  await expect.poll(() => document.querySelector("[role=listbox]")).not.toBeNull();
});
