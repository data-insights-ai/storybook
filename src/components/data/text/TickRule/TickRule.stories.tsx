import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { TickRule } from "./TickRule";

const meta = {
  title: "Data/Text/TickRule",
  component: TickRule,
  tags: ["layer:primitive", "autodocs"],
} satisfies Meta<typeof TickRule>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The one ornament in the system: an 8px tick scale. It closes a block
 * that reports a measurement, and nothing else.
 */
export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <p className="di-mono" style={{ fontSize: 28, letterSpacing: "-0.015em" }}>
        4,182
      </p>
      <TickRule />
      <p className="di-mono" style={{ fontSize: 11, marginTop: 8, opacity: 0.75 }}>
        entries on record
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-tick-rule")).toHaveAttribute("aria-hidden", "true");
  },
};
