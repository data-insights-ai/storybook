import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Highlight } from "./Highlight";

const meta = {
  title: "Data/Text/Highlight",
  component: Highlight,
  tags: ["layer:primitive", "autodocs"],
  args: { variant: "passage", children: "without a new source" },
  argTypes: {
    variant: { control: "radio", options: ["passage", "figure"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A passage: the poppy tint under the words the page is about. */
export const Passage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mark = canvas.getByText("without a new source");
    await expect(mark.tagName).toBe("MARK");
    await expect(mark).toBeVisible();
  },
};

/** A key figure, in poppy ink. The tint stays off, so the figure carries alone. */
export const Figure: Story = {
  args: { variant: "figure", children: "94 %" },
};

/**
 * In the line it marks. The highlight takes the line's type, so it sits at
 * any size the claim is set in.
 */
export const InClaim: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p
      style={{
        maxWidth: "28ch",
        fontSize: "var(--di-font-size-600)",
        fontWeight: "var(--di-weight-medium)",
        lineHeight: "var(--di-leading-snug)",
        color: "var(--di-text)",
      }}
    >
      Coverage rose to <Highlight variant="figure">94 %</Highlight> —{" "}
      <Highlight>without a new source</Highlight>.
    </p>
  ),
};

/** After dark, both roles remap: the night tint under the passage, poppy 300 as the figure. */
export const NightSheet: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      data-theme="dark"
      style={{
        padding: "var(--di-space-16)",
        borderRadius: "var(--di-radius-surface)",
        background: "var(--di-bg-page)",
        color: "var(--di-text)",
        fontSize: "var(--di-font-size-600)",
      }}
    >
      Coverage rose to <Highlight variant="figure">94 %</Highlight> —{" "}
      <Highlight>without a new source</Highlight>.
    </div>
  ),
};
