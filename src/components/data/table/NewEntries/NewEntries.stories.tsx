import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { NewEntries } from "./NewEntries";

const meta = {
  title: "Data/Table/NewEntries",
  component: NewEntries,
  tags: ["layer:primitive", "autodocs"],
  args: { label: "4 new entries", onShow: fn() },
} satisfies Meta<typeof NewEntries>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Arrived: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "4 new entries" }));
    await expect(args.onShow).toHaveBeenCalled();
  },
};
