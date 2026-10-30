import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { SeverityMark, type Severity } from "./SeverityMark";

const meta = {
  title: "Marks/Status/SeverityMark",
  component: SeverityMark,
  tags: ["layer:primitive", "autodocs"],
  args: { level: "high", label: "High", variant: "mark" },
  argTypes: {
    level: { control: "radio", options: ["critical", "high", "medium", "low", "info"] },
    label: { control: "text" },
    variant: { control: "radio", options: ["mark", "chip", "bare"] },
  },
} satisfies Meta<typeof SeverityMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A filled mark and the word: the word carries the meaning, the colour confirms it. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("High")).toBeVisible();
    await expect(canvasElement.querySelectorAll(".di-sev-step.is-on")).toHaveLength(3);
  },
};

const scale: Array<[Severity, string]> = [
  ["critical", "Critical"],
  ["high", "High"],
  ["medium", "Medium"],
  ["low", "Low"],
  ["info", "Info"],
];

/** The one scale, in order. Every product and every chart uses these five. */
export const Scale: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {scale.map(([level, label]) => (
        <SeverityMark key={level} level={level} label={label} />
      ))}
    </div>
  ),
};

/** The tint stops the eye on a critical item, such as a case's own header. */
export const Chip: Story = {
  args: { level: "critical", label: "Critical", variant: "chip" },
};

/** In a column headed "Severity" the word is read out but not printed. */
export const Bare: Story = {
  args: { level: "medium", label: "Medium", variant: "bare" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Medium")).toHaveClass("di-sr");
  },
};
