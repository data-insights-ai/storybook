import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FieldHint } from "./FieldHint";

const meta = {
  title: "Forms/FieldHint",
  component: FieldHint,
  tags: ["autodocs"],
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
};

/** The same line, reading as the failure. It never stacks under the help. */
export const Error: Story = {
  args: { tone: "error", children: "This host did not resolve." },
};

/** Empty text renders nothing at all, so a field can leave it unset. */
export const Empty: Story = {
  args: { children: "" },
};
