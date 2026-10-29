import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Highlight } from "../../../data/text/Highlight";
import { StatusPill } from "../../../data/marks/StatusPill";
import { SectionTitle, SectionTitleHeading, SectionTitleMeta } from "./SectionTitle";

const meta = {
  title: "Layout/Page/SectionTitle",
  component: SectionTitle,
  tags: ["layer:block", "autodocs"],
  args: {
    eyebrow: "",
    lede: "Active endpoints for security events",
    tier: "console",
    children: null,
  },
  argTypes: {
    eyebrow: { control: "text" },
    lede: { control: "text" },
    tier: { control: "radio", options: ["console", "brand"] },
    children: { control: false },
  },
  render: (args) => (
    <SectionTitle {...args}>
      <SectionTitleHeading>Notification channels</SectionTitleHeading>
    </SectionTitle>
  ),
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Notification channels" })).toBeVisible();
  },
};

/** Without the lede, where the heading already says everything. */
export const TitleOnly: Story = {
  args: { lede: "" },
};

/** The meta slot: a count, a timestamp, or a short status. */
export const WithMeta: Story = {
  render: (args) => (
    <SectionTitle {...args}>
      <SectionTitleHeading>Notification channels</SectionTitleHeading>
      <SectionTitleMeta>
        <StatusPill tone="ok">synced</StatusPill>
      </SectionTitleMeta>
    </SectionTitle>
  ),
};

/**
 * The plain eyebrow. It repeats down a page, unlike the sealed `Eyebrow`,
 * which marks the one section on record.
 */
export const WithEyebrow: Story = {
  args: { eyebrow: "02 — Delivery" },
};

/**
 * The display tier, which is what a brand page sets over every section:
 * 28px up to 34, measured to 22ch, and no bottom margin — the stack owns
 * the distance to the next section.
 */
export const Brand: Story = {
  args: {
    eyebrow: "Two",
    lede: "No accent colour acts. Body text is navy; the one filled control on a sheet is navy.",
    tier: "brand",
  },
  render: (args) => (
    <SectionTitle {...args}>
      <SectionTitleHeading>Navy is the ink and the action.</SectionTitleHeading>
    </SectionTitle>
  ),
};

/**
 * A heading with a marked passage. One per page: a page that highlighted
 * every section heading would have marked nothing.
 */
export const WithHighlight: Story = {
  args: {
    eyebrow: "Two",
    lede: "No accent colour acts. Body text is navy; the one filled control on a sheet is navy.",
    tier: "brand",
  },
  render: (args) => (
    <SectionTitle {...args}>
      <SectionTitleHeading>
        Navy is the ink <Highlight>and the action</Highlight>.
      </SectionTitleHeading>
    </SectionTitle>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2, name: "Navy is the ink and the action." });
    await expect(within(heading).getByText("and the action").tagName).toBe("MARK");
  },
};
