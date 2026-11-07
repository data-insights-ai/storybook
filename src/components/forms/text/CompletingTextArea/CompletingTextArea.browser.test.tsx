import { afterEach, expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { useState } from "react";
import "../../../../styles/styles.css";
import { CompletingTextArea, type Completion } from "./CompletingTextArea";

let root: Root | undefined;

afterEach(() => {
  root?.unmount();
  document.body.replaceChildren();
});

const suggest = (text: string, caret: number): Completion | undefined =>
  text.slice(0, caret).endsWith("ev")
    ? {
        items: [
          { value: "event", label: "event" },
          { value: "evidence", label: "evidence" },
        ],
        apply: (value) => ({
          text: text.slice(0, caret - 2) + value + text.slice(caret),
          caret: caret - 2 + value.length,
        }),
      }
    : undefined;

function Field() {
  const [value, setValue] = useState("");
  return (
    <CompletingTextArea
      id="x"
      label="Condition"
      value={value}
      onValueChange={setValue}
      suggest={suggest}
      suggestionsLabel="Fields"
    />
  );
}

test("arrows move the highlight, Tab takes it, Escape closes, and focus stays in the text", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(<Field />));
  const field = host.querySelector("textarea")!;
  await userEvent.click(field);
  await userEvent.keyboard("a ev");
  expect(host.querySelector("[role=listbox]")).not.toBeNull();
  expect(field.getAttribute("aria-activedescendant")).toBe("x-suggestions-0");
  await userEvent.keyboard("{ArrowDown}{Tab}");
  expect(field.value).toBe("a evidence");
  expect(document.activeElement).toBe(field);
  expect(host.querySelector("[role=listbox]")).toBeNull();
  await userEvent.keyboard(" ev{Escape}");
  expect(host.querySelector("[role=listbox]")).toBeNull();
  expect(field.hasAttribute("aria-activedescendant")).toBe(false);
});

test("a moved caret drops the list, so Enter makes a new line instead of taking a completion", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  flushSync(() => root!.render(<Field />));
  const field = host.querySelector("textarea")!;
  await userEvent.click(field);
  await userEvent.keyboard("a ev");
  expect(host.querySelector("[role=listbox]")).not.toBeNull();
  await userEvent.keyboard("{ArrowLeft}{Enter}");
  expect(field.value).toBe("a e\nv");
  expect(host.querySelector("[role=listbox]")).toBeNull();
});
