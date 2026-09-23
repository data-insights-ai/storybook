import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stepper } from "./Tabs";

const meta = {
  title: "Blocks/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: {
    label: "Source registration",
    stateLabels: { done: "Done", current: "Current step", upcoming: "Not started" },
    steps: [
      { label: "Connect", state: "done" },
      { label: "Verify", state: "done" },
      { label: "Seal", state: "current" },
      { label: "Publish", state: "upcoming" },
    ],
  },
  argTypes: {
    label: { control: "text" },
    steps: { control: false },
    stateLabels: { control: false },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A bounded process, and only that. It never stands in for the rail. */
export const InProgress: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Current step")).toBeInTheDocument();
  },
};

export const FirstStep: Story = {
  args: {
    steps: [
      { label: "Connect", state: "current" },
      { label: "Verify", state: "upcoming" },
      { label: "Seal", state: "upcoming" },
      { label: "Publish", state: "upcoming" },
    ],
  },
};

export const LastStep: Story = {
  args: {
    steps: [
      { label: "Connect", state: "done" },
      { label: "Verify", state: "done" },
      { label: "Seal", state: "done" },
      { label: "Publish", state: "current" },
    ],
  },
};

export const Complete: Story = {
  args: {
    steps: [
      { label: "Connect", state: "done" },
      { label: "Verify", state: "done" },
      { label: "Seal", state: "done" },
      { label: "Publish", state: "done" },
    ],
  },
};

/** Two steps: the shortest bounded process worth a stepper. */
export const Pair: Story = {
  args: {
    steps: [
      { label: "Confirm", state: "done" },
      { label: "Seal", state: "current" },
    ],
  },
};
