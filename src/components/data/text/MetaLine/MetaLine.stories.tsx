import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MetaLine } from "./MetaLine";

const meta = {
  title: "Data/Text/MetaLine",
  component: MetaLine,
  tags: ["layer:primitive", "autodocs"],
  args: { items: "As of 12 Oct, 10:00 · 14 sources · updates live", align: "start" },
  argTypes: {
    items: { control: "text" },
    align: { control: "radio", options: ["start", "end"] },
  },
} satisfies Meta<typeof MetaLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each fact is one item; the separator is drawn, not read. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("14 sources")).toBeVisible();
  },
};

/**
 * In a narrow column the line breaks between items, never inside one, and
 * no line starts on a separator.
 */
export const Narrow: Story = {
  args: { items: ["Opened 7 h ago", "1,064 signals", "39 hosts", "updates live"] },
  render: (args) => (
    <div style={{ width: 180 }}>
      <MetaLine {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-meta-line-item"));
    const lines = new Set(items.map((item) => Math.round(item.getBoundingClientRect().top)));
    await expect(lines.size).toBeGreaterThan(1);
    const heights = new Set(items.map((item) => Math.round(item.getBoundingClientRect().height)));
    await expect(heights.size).toBe(1);
  },
};

/** Against the right edge, as a page header's meta sits on a wide page. */
export const End: Story = {
  args: { align: "end" },
};
