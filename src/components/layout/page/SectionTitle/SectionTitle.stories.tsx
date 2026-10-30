import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "../../../marks/status/StatusPill";
import { SectionTitle, SectionTitleHeading, SectionTitleMeta } from "./SectionTitle";

const meta = {
  title: "Layout/Page/SectionTitle",
  component: SectionTitle,
  tags: ["layer:block", "autodocs", "status:deprecated"],
  args: {
    eyebrow: "",
    lede: "Where alerts go when a source stops or a rule fires.",
    tier: "console",
    children: null,
  },
  argTypes: {
    eyebrow: { control: "text" },
    lede: { control: "text" },
    tier: { control: "radio", options: ["console", "brand"] },
    children: { control: false },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Deprecated: removed in 0.12.0. Write `<PageHeader level={2}>` with
 * `PageHeaderTitle` and `PageHeaderMeta` (`Layout/Page/PageHeader` → Section);
 * this wrapper renders exactly that.
 */
export const Default: Story = {
  render: (args) => (
    <SectionTitle {...args}>
      <SectionTitleHeading>Notification channels</SectionTitleHeading>
      <SectionTitleMeta>
        <StatusPill tone="ok">synced</StatusPill>
      </SectionTitleMeta>
    </SectionTitle>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 2, name: "Notification channels" })).toBeVisible();
  },
};
