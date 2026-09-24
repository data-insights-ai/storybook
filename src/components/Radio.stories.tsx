import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ChoiceGroup, Radio } from "./Choice";

const meta = {
  title: "Forms/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: {
    id: "retention-30",
    name: "retention",
    label: "30 days",
    description: "",
    defaultChecked: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    id: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("30 days")).not.toBeChecked();
  },
};

export const Selected: Story = {
  args: { defaultChecked: true },
};

/** The click, kept out of the two stories named for a resting state. */
export const Selecting: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByLabelText("30 days");
    await userEvent.click(radio);
    await expect(radio).toBeChecked();
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const WithDescription: Story = {
  args: { defaultChecked: true, description: "The default for a new workspace." },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Not available under the current policy." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("30 days")).toBeDisabled();
  },
};

export const DisabledSelected: Story = {
  args: { disabled: true, defaultChecked: true, description: "Fixed by the workspace policy." },
};

/**
 * A radio only means anything in a group: one shared `name`, one fieldset,
 * one visible legend. Arrow keys move the choice within it.
 */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ChoiceGroup legend="Retention">
      <Radio
        id="r1"
        name="retention"
        label="30 days"
        description="The default for a new workspace."
        defaultChecked={true}
      />
      <Radio id="r2" name="retention" label="1 year" />
      <Radio id="r3" name="retention" label="Indefinite" description="Requires an audit key." />
      <Radio
        id="r4"
        name="retention"
        label="Do not retain"
        disabled={true}
        description="Not available under the current policy."
      />
    </ChoiceGroup>
  ),
};
