import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { CompletingTextArea, type Completion } from "./CompletingTextArea";
import { onPanel } from "../../../../../.storybook/onPanel";

const paths = [
  { path: "severity", type: "string" },
  { path: "source.host", type: "string" },
  { path: "source.ip", type: "ip" },
  { path: "occurredAt", type: "timestamp" },
];

// Completes `event.<path>` at the caret, as an expression editor does.
function suggest(text: string, caret: number): Completion | undefined {
  const match = /event\.([\w.]*)$/.exec(text.slice(0, caret));
  if (!match) return undefined;
  const typed = match[1]!;
  const start = caret - typed.length;
  return {
    items: paths
      .filter((p) => p.path.startsWith(typed))
      .map((p) => ({ value: p.path, label: `event.${p.path}`, meta: p.type })),
    apply: (value) => ({ text: text.slice(0, start) + value + text.slice(caret), caret: start + value.length }),
  };
}

function Expression(props: { hint?: string; hintTone?: "neutral" | "error" }) {
  const [value, setValue] = useState("");
  return (
    <CompletingTextArea
      id="condition"
      label="Condition"
      mono
      value={value}
      onValueChange={setValue}
      suggest={suggest}
      suggestionsLabel="Event fields"
      suggestionsCount={(n) => `${n} suggestions`}
      {...props}
    />
  );
}

const meta = {
  title: "Forms/Text/CompletingTextArea",
  component: CompletingTextArea,
  tags: ["layer:form", "autodocs"],
  decorators: [
    onPanel("Export mapping"),
    (Story) => (
      <div style={{ maxWidth: 560, minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
  render: () => <Expression hint="A CEL expression over the event." />,
} satisfies Meta<typeof CompletingTextArea>;

export default meta;

const args = {
  id: "condition",
  label: "Condition",
  value: "",
  onValueChange: () => {},
  suggest,
  suggestionsLabel: "Event fields",
  suggestionsCount: (n: number) => `${n} suggestions`,
};

export const Completing: StoryObj<typeof meta> = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Condition" });
    await userEvent.type(field, "event.so");
    const list = canvas.getByRole("listbox", { name: "Event fields" });
    await expect(within(list).getAllByRole("option")).toHaveLength(2);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(field).toHaveValue("event.source.ip");
    await expect(canvas.queryByRole("listbox")).toBeNull();
  },
};

export const Invalid: StoryObj<typeof meta> = {
  args,
  render: () => <Expression hint="Unknown field event.sorce." hintTone="error" />,
};
