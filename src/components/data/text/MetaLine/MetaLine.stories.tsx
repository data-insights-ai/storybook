import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { MetaLine } from "./MetaLine";

const meta = {
  title: "Data/Text/MetaLine",
  component: MetaLine,
  tags: ["layer:primitive", "autodocs"],
  args: {
    items: "As of 12 Oct, 10:00 · 14 sources · updates live",
    align: "start",
    separator: "dot",
  },
  argTypes: {
    items: { control: "text" },
    align: { control: "radio", options: ["start", "end"] },
    separator: { control: "radio", options: ["dot", "arrow"] },
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
  args: {
    items: ["Opened 7 h ago", "1,064 signals", "39 hosts", "updates live"],
  },
  render: (args) => (
    <div style={{ width: 180 }}>
      <MetaLine {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".di-meta-line-item"),
    );
    const lines = new Set(
      items.map((item) => Math.round(item.getBoundingClientRect().top)),
    );
    await expect(lines.size).toBeGreaterThan(1);
    const heights = new Set(
      items.map((item) => Math.round(item.getBoundingClientRect().height)),
    );
    await expect(heights.size).toBe(1);
  },
};

/** Against the right edge, as a page header's meta sits on a wide page. */
export const End: Story = {
  args: { align: "end" },
};

/** A path: where it entered, what it crossed, where the data went. */
export const Path: Story = {
  args: {
    items: ["vpn-gw-01", "ws-fin-014", "srv-fs-02", "192.0.2.88"],
    separator: "arrow",
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-meta-line")).toHaveClass(
      "is-path",
    );
  },
};

/** A screen reader hears the items as a list; an item longer than the line wraps inside instead of being clipped. */
export const LongItem: Story = {
  args: {
    items: [
      "vpn-gw-01",
      "a-very-long-host-name-that-is-wider-than-the-column.finance.example.org",
      "srv-fs-02",
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    const line = canvasElement
      .querySelector(".di-meta-line")!
      .getBoundingClientRect();
    for (const item of canvasElement.querySelectorAll(".di-meta-line-item")) {
      await expect(item.getBoundingClientRect().right).toBeLessThanOrEqual(
        line.right + 1,
      );
    }
  },
};
