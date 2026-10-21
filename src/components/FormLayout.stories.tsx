import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import { FieldStack } from "./FormLayout";
import { Actions } from "./Layout";
import { Select } from "./Select";
import { TextField } from "./TextField";

const meta = {
  title: "Patterns/Layout/FieldStack",
  component: FieldStack,
  tags: ["autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof FieldStack>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One column at the form measure: text and email span it, a select fits its options, a number is short. */
export const Widths: Story = {
  render: () => (
    <form>
      <FieldStack>
        <TextField id="fs-name" label="Name" defaultValue="Northwind Survey" />
        <TextField id="fs-email" type="email" label="Billing email" defaultValue="nora.feld@data-insights.ai" />
        <Select id="fs-role" label="Role" mono={false} defaultValue="member">
          <option value="member">Member</option>
          <option value="admin">Administrator</option>
        </Select>
        <TextField id="fs-seats" type="number" label="Seats" defaultValue="25" />
        <Actions>
          <Button variant="secondary">Cancel</Button>
          <Button type="submit">Save</Button>
        </Actions>
      </FieldStack>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText("Billing email").getBoundingClientRect().width;
    const seats = canvas.getByLabelText("Seats").getBoundingClientRect().width;
    await expect(email).toBeGreaterThan(seats * 2);
  },
};
