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
    tone: { control: "radio", options: ["neutral", "alert", "seal", "quiet"] },
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

/** The counts as the rail shows them beside its links, and the quiet count a tab carries on paper. */
export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: "var(--di-gap-12)", maxWidth: 280 }}>
      <ul
        style={{
          display: "grid",
          gap: "var(--di-gap-8)",
          margin: 0,
          padding: "var(--di-space-12)",
          listStyle: "none",
          borderRadius: "var(--di-radius-surface)",
          background: "var(--di-sidebar-bg)",
          color: "var(--di-sidebar-fg)",
        }}
      >
        <li style={{ display: "flex", justifyContent: "space-between" }}>
          Cases <Badge tone="neutral">8</Badge>
        </li>
        <li style={{ display: "flex", justifyContent: "space-between" }}>
          Alerts <Badge tone="alert">3</Badge>
        </li>
        <li style={{ display: "flex", justifyContent: "space-between" }}>
          Sealed records <Badge tone="seal">6</Badge>
        </li>
      </ul>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--di-gap-6)" }}>
        Open findings <Badge tone="quiet">12</Badge>
      </span>
    </div>
  ),
};
