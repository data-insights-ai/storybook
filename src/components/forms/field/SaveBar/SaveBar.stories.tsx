import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { SaveBar } from "./SaveBar";

const meta = {
  title: "Forms/Field/SaveBar",
  component: SaveBar,
  tags: ["layer:form", "autodocs"],
  args: { label: "Unsaved changes", message: "2 unsaved changes", children: null },
} satisfies Meta<typeof SaveBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unsaved: Story = {
  render: (args) => (
    <SaveBar {...args}>
      <Button variant="secondary">Discard</Button>
      <Button>Save changes</Button>
    </SaveBar>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", { name: "Unsaved changes" });
    await expect(region).toHaveTextContent("2 unsaved changes");
  },
};
