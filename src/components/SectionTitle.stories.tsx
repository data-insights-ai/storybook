import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "./StatusPill";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Blocks/SectionTitle",
  component: SectionTitle,
  tags: ["autodocs"],
  args: {
    eyebrow: "",
    title: "Notification channels",
    lede: "Active endpoints for security events",
    tier: "console",
    children: null,
  },
  argTypes: {
    eyebrow: { control: "text" },
    title: { control: "text" },
    lede: { control: "text" },
    tier: { control: "radio", options: ["console", "brand"] },
    children: { control: false },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Notification channels" })).toBeVisible();
  },
};

/** Without the lede, where the heading already says everything. */
export const TitleOnly: Story = {
  args: { lede: "" },
};

/** The trailing slot: a count, a timestamp, or a short status. */
export const WithMeta: Story = {
  render: (args) => (
    <SectionTitle {...args}>
      <StatusPill tone="ok">synced</StatusPill>
    </SectionTitle>
  ),
};

/**
 * The plain eyebrow. It repeats down a page, unlike the sealed `Eyebrow`,
 * which marks the one section on record.
 */
export const WithEyebrow: Story = {
  args: { eyebrow: "§ 02 — Delivery" },
};

/**
 * The display tier, which is what a brand page sets over every section:
 * 28px up to 34, measured to 22ch, and no bottom margin — the stack owns
 * the distance to the next section.
 */
export const Brand: Story = {
  args: {
    eyebrow: "Two",
    title: "Navy is the ink and the action.",
    lede: "There is no invented accent colour. Body text is navy; the one filled control on a sheet is navy.",
    tier: "brand",
  },
};
