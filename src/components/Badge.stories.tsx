import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge, VersionTag } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    tone: "neutral",
    children: "08",
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
    await expect(canvas.getByText("08")).toBeVisible();
  },
};

export const Alert: Story = {
  args: { tone: "alert", children: "03" },
};

/** Gold: something in this section is sealed. */
export const Gold: Story = {
  args: { tone: "gold", children: "06" },
};

export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 8, padding: 12, background: "var(--di-navy-900)", borderRadius: 8 }}>
      <Badge tone="neutral">08</Badge>
      <Badge tone="alert">03</Badge>
      <Badge tone="gold">06</Badge>
    </div>
  ),
};

/** A version or a short hash: it names a thing, it does not report a state. */
export const Version: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <VersionTag>v4.18.2</VersionTag>
      <VersionTag>build 7f3a99e</VersionTag>
    </div>
  ),
};
