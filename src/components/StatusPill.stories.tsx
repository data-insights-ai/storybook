import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Primitives/StatusPill",
  component: StatusPill,
  tags: ["autodocs"],
  args: {
    tone: "ok",
    dot: true,
    children: "running",
  },
  argTypes: {
    tone: {
      control: "radio",
      options: ["ok", "warn", "danger", "recorded", "neutral", "ai"],
    },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("running")).toBeVisible();
  },
};

/** Paused runs on the gold ramp, never on a second yellow. */
export const Paused: Story = {
  args: { tone: "warn", children: "paused" },
};

export const Failed: Story = {
  args: { tone: "danger", children: "failed" },
};

/** A fact the register holds, rather than a state a machine is in. */
export const Recorded: Story = {
  args: { tone: "recorded", children: "sealed" },
};

export const Neutral: Story = {
  args: { tone: "neutral", children: "queued" },
};

/** A model's claim: the hollow ring, never a filled dot. */
export const Inferred: Story = {
  args: { tone: "ai", children: "ai insight" },
};

/** Without the dot, where a column of pills already reads as one channel. */
export const WithoutDot: Story = {
  args: { dot: false, children: "running" },
};

/** The whole set. Every word clears 5:1 on its own wash. */
export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <StatusPill tone="ok">running</StatusPill>
      <StatusPill tone="warn">paused</StatusPill>
      <StatusPill tone="danger">failed</StatusPill>
      <StatusPill tone="recorded">sealed</StatusPill>
      <StatusPill tone="neutral">queued</StatusPill>
      <StatusPill tone="ai">ai insight</StatusPill>
    </div>
  ),
};

/** The same six on the night sheet, each still above 5:1 on its wash. */
export const NightSheet: Story = {
  globals: { theme: "dark" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <StatusPill tone="ok">running</StatusPill>
      <StatusPill tone="warn">paused</StatusPill>
      <StatusPill tone="danger">failed</StatusPill>
      <StatusPill tone="recorded">sealed</StatusPill>
      <StatusPill tone="neutral">queued</StatusPill>
      <StatusPill tone="ai">ai insight</StatusPill>
    </div>
  ),
};
