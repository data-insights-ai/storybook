import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Figure } from "../../../figures/Figure";
import { TickRule } from "./TickRule";

const meta = {
  title: "Text/Blocks/TickRule",
  component: TickRule,
  tags: ["layer:primitive", "autodocs"],
} satisfies Meta<typeof TickRule>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The one ornament: it closes a block that reports a measurement, here a figure on a report cover. */
export const UnderAFigure: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--di-gap-8)", maxWidth: "20rem" }}>
      <Figure label="Entries on record" value="4,182" size="hero" />
      <TickRule />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-tick-rule")).toHaveAttribute("aria-hidden", "true");
  },
};

/** `thin` under a compact figure. */
export const Thin: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--di-gap-8)", maxWidth: "12rem" }}>
      <Figure label="Sources" value="14" size="compact" />
      <TickRule thin />
    </div>
  ),
};
