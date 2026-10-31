import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TextField } from "../../text/TextField";
import { FieldHint } from "./FieldHint";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Forms/Field/FieldHint",
  component: FieldHint,
  tags: ["layer:form", "autodocs"],
  decorators: [onPanel("Source")],
  args: {
    id: "hint",
    tone: "neutral",
    children: "A host name, without a scheme or a path.",
  },
  argTypes: {
    id: { control: "text" },
    tone: { control: "radio", options: ["neutral", "sealed", "error"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof FieldHint>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The one line under a control. `TextField` and `Select` both render it,
 * so a product building its own control can keep the same three tones
 * rather than inventing a fourth.
 */
export const Neutral: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("A host name, without a scheme or a path.")).toBeVisible();
  },
};

/** A resolved value the register can vouch for, carrying the seal. */
export const Sealed: Story = {
  args: { tone: "sealed", children: "resolved 2026-09-18T09:12:04Z" },
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector(".di-seal-mark")!.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(canvasElement.querySelector(".di-field-hint > span:last-child")!);
    const line = range.getClientRects()[0];
    await expect(Math.abs(mark.top + mark.height / 2 - (line.top + line.height / 2))).toBeLessThanOrEqual(1);
  },
};

/** The same line, reading as the failure. It never stacks under the help. */
export const Error: Story = {
  args: { tone: "error", children: "This host did not resolve." },
};

/**
 * Empty text renders nothing at all, so a field can leave it unset: a `TextField` with no `hint` ends on its
 * control, with no empty line and no gap under it, and nothing describes the input.
 */
export const Empty: Story = {
  args: { children: "" },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <TextField id="empty-hint-host" label="Host" defaultValue="feed.example.io" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector(".di-field")!;
    await expect(field.querySelector(".di-field-hint")).toBeNull();
    const input = within(canvasElement).getByRole("textbox", { name: "Host" });
    await expect(input).not.toHaveAttribute("aria-describedby");
    const control = input.closest(".di-control") ?? input;
    await expect(Math.abs(field.getBoundingClientRect().bottom - control.getBoundingClientRect().bottom)).toBeLessThan(
      1,
    );
  },
};
