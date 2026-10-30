import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { SkeletonTable } from "./SkeletonTable";

const meta = {
  title: "Feedback/Waiting/SkeletonTable",
  component: SkeletonTable,
  tags: ["layer:primitive", "status:deprecated"],
  args: { label: "Loading sources" },
} satisfies Meta<typeof SkeletonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Deprecated: SkeletonTable is `Loading shape="table" index`. Use `Loading`. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toHaveTextContent("Loading sources"));
  },
};
