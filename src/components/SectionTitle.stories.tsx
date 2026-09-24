import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "./StatusPill";
import { SectionTitle } from "./SectionTitle";

const meta = {
  title: "Blocks/SectionTitle",
  component: SectionTitle,
  tags: ["autodocs"],
  args: {
    title: "Notification channels",
    lede: "Active endpoints for security events",
    children: null,
  },
  argTypes: {
    title: { control: "text" },
    lede: { control: "text" },
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
