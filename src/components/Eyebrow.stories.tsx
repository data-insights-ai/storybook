import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Eyebrow } from "./Seal";

const meta = {
  title: "Primitives/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  args: { children: "§ 04 — Coverage", variant: "sealed" },
  argTypes: {
    children: { control: "text" },
    variant: { control: "radio", options: ["sealed", "plain"] },
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

/**
 * The label alone. This is the one a brand page sets over every section,
 * and the one `PageHeader` and `SectionTitle` render from their `eyebrow`
 * string — a page that repeated the sealed variant would be claiming a
 * seal per heading.
 */
export const Plain: Story = {
  args: { children: "Brand essence", variant: "plain" },
};

/** The pair, which is how the rule and its absence actually read. */
export const Pair: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ maxWidth: 440 }}>
      <Eyebrow>§ 04 — Coverage</Eyebrow>
      <Eyebrow variant="plain">§ 05 — Sources</Eyebrow>
    </div>
  ),
};
