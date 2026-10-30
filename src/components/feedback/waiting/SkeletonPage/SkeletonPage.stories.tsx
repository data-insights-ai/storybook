import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { SkeletonPage } from "./SkeletonPage";

const meta = {
  title: "Feedback/Waiting/SkeletonPage",
  component: SkeletonPage,
  tags: ["layer:primitive", "status:deprecated"],
  args: { variant: "list", label: "Loading members" },
} satisfies Meta<typeof SkeletonPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: SkeletonPage is `Loading shape="list"` (or `detail`, `form`). Use `Loading`. */
export const List: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Loading members"));
  },
};
