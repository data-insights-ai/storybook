import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CaseTriage } from "./CaseTriage";

const meta = {
  title: "Patterns/Case triage",
  component: CaseTriage,
  tags: ["layer:screen", "!autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CaseTriage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * List and case side by side. The list is its own pane a step above the
 * ground, the open case is lifted with the cornflower edge, and the case
 * opens on its verdict: the one gold object, with the action it asks for.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { current: true })).toHaveTextContent("Leaked VPN credentials");
    await expect(canvasElement.querySelectorAll(".is-emphasis")).toHaveLength(1);
    if (window.innerWidth >= 900) {
      await expect(canvas.getByRole("heading", { level: 3, name: /Leaked VPN credentials reached the file server/ })).toBeVisible();
    }
  },
};

/** Another case opens beside the list; without a verdict it says so and points to the signals. */
export const AnotherCase: Story = {
  name: "Another case",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Periodic beaconing/ }));
    await expect(canvas.getByText("No verdict yet")).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2, name: /Case 6/ })).toBeVisible();
  },
};

/** On a phone the two take turns: here the open case, with the way back to the list. */
export const CaseOpen: Story = {
  name: "Case open",
  args: { showing: "detail" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 3, name: /Leaked VPN credentials reached the file server/ })).toBeVisible();
  },
};
