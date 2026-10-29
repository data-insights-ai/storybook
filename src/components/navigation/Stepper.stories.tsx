import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Stepper } from "./Stepper";

const meta = {
  title: "Primitives/Stepper",
  component: Stepper,
  tags: ["layer:primitive", "autodocs"],
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

/** A completed step is a button that returns to it. */
export const Returnable: StoryObj<typeof meta> = {
  args: { onStep: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const done = canvas.getAllByRole("button")[0];
    await userEvent.click(done);
    await expect(args.onStep).toHaveBeenCalledWith(0);
  },
};

/** The connector stops at the circle's edge: no line crosses a number, in any state or width. */
export const ConnectorsClearTheCircles: StoryObj<typeof meta> = {
  play: async ({ canvasElement }) => {
    const steps = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-step"));
    await expect(steps.length).toBeGreaterThan(1);
    for (const step of steps.slice(1)) {
      const line = getComputedStyle(step, "::before");
      const bullet = step.querySelector<HTMLElement>(".di-step-bullet")!.getBoundingClientRect();
      const previous = step.previousElementSibling!.querySelector<HTMLElement>(".di-step-bullet")!.getBoundingClientRect();
      const stepBox = step.getBoundingClientRect();
      const lineLeft = stepBox.left + parseFloat(line.left);
      const lineRight = stepBox.right - parseFloat(line.right);
      await expect(lineLeft).toBeGreaterThanOrEqual(previous.right);
      await expect(lineRight).toBeLessThanOrEqual(bullet.left);
    }
  },
};

/** Inline: one line from the left edge, each name beside its bullet, for a wide page. */
export const Inline: StoryObj<typeof meta> = {
  args: { layout: "inline" },
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector<HTMLElement>(".di-stepper")!.getBoundingClientRect();
    const bullets = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-step-bullet")).map((b) =>
      b.getBoundingClientRect(),
    );
    await expect(Math.round(bullets[0].left)).toBe(Math.round(list.left));
    for (const bullet of bullets) await expect(Math.round(bullet.top)).toBe(Math.round(bullets[0].top));
    await expect(bullets[bullets.length - 1].left - bullets[0].left).toBeLessThan(600);
  },
};
