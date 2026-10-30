import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./Badge";

const meta = {
  title: "Marks/Badge",
  component: Badge,
  tags: ["layer:primitive", "autodocs"],
  args: {
    tone: "neutral",
    children: "8",
  },
  argTypes: {
    tone: { control: "radio", options: ["neutral", "alert", "gold"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A count in the rail. Badges sit on the navy, not on paper. */
export const Neutral: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("8")).toBeVisible();
  },
};

export const Alert: Story = {
  args: { tone: "alert", children: "3" },
};

/** Seal: something in this section is sealed. */
export const Seal: Story = {
  args: { tone: "seal", children: "6" },
};

export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 8, padding: 12, background: "var(--di-sidebar-bg)", borderRadius: 8 }}>
      <Badge tone="neutral">8</Badge>
      <Badge tone="alert">3</Badge>
      <Badge tone="seal">6</Badge>
    </div>
  ),
};
