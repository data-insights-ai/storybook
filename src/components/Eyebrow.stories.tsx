import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Eyebrow } from "./Seal";

const meta = {
  title: "Primitives/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  args: { children: "§ 04 — Coverage", dot: true },
  argTypes: {
    children: { control: "text" },
    dot: { control: "boolean" },
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The § mark, the seal and a rule to the edge. One gold dot per view. */
export const Sealed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("§ 04 — Coverage")).toBeVisible();
  },
};

/** Without the dot, where this section is not the one carrying the seal. */
export const WithoutDot: Story = {
  args: { children: "§ 05 — Sources", dot: false },
};

/** A pair, which is how the rule between them actually reads. */
export const Pair: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }}>
      <Eyebrow>§ 04 — Coverage</Eyebrow>
      <Eyebrow dot={false}>§ 05 — Sources</Eyebrow>
    </div>
  ),
};
