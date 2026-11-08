import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PageFailure } from "./PageFailure";

const meta = {
  title: "Feedback/Recovery/PageFailure",
  component: PageFailure,
  tags: ["layer:block", "autodocs"],
  args: {
    title: "This page could not be shown",
    body: "Load a fresh copy; the rest of the app keeps working.",
    reloadLabel: "Reload",
  },
} satisfies Meta<typeof PageFailure>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What a failed page shows in its place, with a fresh document to load. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("button", { name: "Reload" })).toBeVisible();
  },
};
