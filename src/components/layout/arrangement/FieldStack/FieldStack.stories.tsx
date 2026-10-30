import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TextField } from "../../../forms/text/TextField";
import { Panel } from "../../page/Panel";
import { FieldStack } from "./FieldStack";

/** Deprecated: `FieldStack` is `Stack variant="form"`. Removed in 0.12. */
const meta = {
  title: "Layout/Arrangement/FieldStack",
  component: FieldStack,
  tags: ["layer:pattern", "status:deprecated"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof FieldStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The old name renders `Stack variant="form"`. */
export const Deprecated: Story = {
  render: () => (
    <Panel title="Organization">
      <FieldStack>
        <TextField id="fs-name" label="Name" defaultValue="Northwind Survey" />
        <TextField id="fs-seats" type="number" label="Seats" defaultValue="25" />
      </FieldStack>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText("Name")).toBeVisible();
  },
};
