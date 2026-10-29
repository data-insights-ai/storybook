import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { AppLoader } from "./AppLoader";

const meta = {
  title: "Feedback/Waiting/AppLoader",
  component: AppLoader,
  tags: ["layer:primitive", "autodocs"],
  parameters: { layout: "fullscreen" },
  args: { label: "Loading", delay: 150 },
  argTypes: { label: { control: "text" }, delay: { control: { type: "number" } } },
} satisfies Meta<typeof AppLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The application starting: the mark centred, its dots breathing in turn. */
export const Starting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Loading")).toBeVisible());
  },
};
