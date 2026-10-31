import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { separatorsAtLineStart } from "../../../../.storybook/tests/lineStart";
import { MetaLine } from "./MetaLine";
import { onPanel } from "../../../../.storybook/onPanel";

const meta = {
  title: "Text/MetaLine",
  component: MetaLine,
  tags: ["layer:primitive", "autodocs"],
  args: { items: "As of 12 Oct, 10:00 · 14 sources · updates live", align: "start", separator: "dot" },
  argTypes: {
    items: { control: "text" },
    align: { control: "radio", options: ["start", "end"] },
    separator: { control: "radio", options: ["dot", "arrow"] },
  },
  decorators: [onPanel("Case 4 · leaked VPN credentials")],
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
    <div style={{ width: "11rem" }}>
      <MetaLine {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-meta-line-item"));
    const lines = new Set(items.map((item) => Math.round(item.getBoundingClientRect().top)));
    await expect(lines.size).toBeGreaterThan(1);
    const heights = new Set(items.map((item) => Math.round(item.getBoundingClientRect().height)));
    await expect(heights.size).toBe(1);
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};

/**
 * Against the right edge, as a page header's meta sits on a wide page; in a
 * narrow column it wraps, and neither line starts with a separator.
 */
export const End: Story = {
  args: { align: "end" },
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <MetaLine {...args} />
      <div style={{ width: "13rem", justifySelf: "end" }}>
        <MetaLine {...args} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [, narrow] = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-meta-line-items"));
    const lines = new Set(Array.from(narrow.children).map((item) => Math.round(item.getBoundingClientRect().top)));
    await expect(lines.size).toBeGreaterThan(1);
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};

/** A path: where it entered, what it crossed, where the data went. */
export const Path: Story = {
  args: { items: ["vpn-gw-01", "ws-fin-014", "srv-fs-02", "192.0.2.88"], separator: "arrow" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector(".di-meta-line")).toHaveClass("is-path");
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};

/** A screen reader hears the items as a list; an item longer than the line wraps inside instead of being clipped. */
export const LongItem: Story = {
  args: {
    items: ["vpn-gw-01", "a-very-long-host-name-that-is-wider-than-the-column.finance.example.org", "srv-fs-02"],
  },
  decorators: [
    (Story) => (
      <div style={{ width: "12.5rem" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    const line = canvasElement.querySelector(".di-meta-line")!.getBoundingClientRect();
    for (const item of canvasElement.querySelectorAll(".di-meta-line-item")) {
      await expect(item.getBoundingClientRect().right).toBeLessThanOrEqual(line.right + 1);
    }
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};

/** German items run longer; each still moves to the next line whole. */
export const German: Story = {
  args: { items: ["Stand 12. Okt., 10:00", "14 Datenquellen", "aktualisiert sich laufend"] },
  decorators: [
    (Story) => (
      <div lang="de" style={{ maxWidth: "16rem" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const items = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-meta-line-item"));
    const heights = new Set(items.map((item) => Math.round(item.getBoundingClientRect().height)));
    await expect(heights.size).toBe(1);
    await expect(separatorsAtLineStart(canvasElement)).toEqual([]);
  },
};
