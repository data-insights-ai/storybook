import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Components/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  args: { children: "Active", tone: "ok", dot: true },
  argTypes: {
    tone: { control: "radio", options: ["ok", "warn", "danger", "neutral"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {};

export const Paused: Story = {
  args: { tone: "warn", children: "Paused" },
};

export const Failed: Story = {
  args: { tone: "danger", children: "High" },
};

export const Neutral: Story = {
  args: { tone: "neutral", children: "Person" },
};

export const Set: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <StatusPill tone="ok">Active</StatusPill>
      <StatusPill tone="ok">Online</StatusPill>
      <StatusPill tone="warn">Paused</StatusPill>
      <StatusPill tone="warn">On request</StatusPill>
      <StatusPill tone="danger">High</StatusPill>
      <StatusPill tone="neutral">Medium</StatusPill>
    </div>
  ),
};
