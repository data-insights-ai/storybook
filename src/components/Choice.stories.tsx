import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Checkbox, ChoiceGroup } from "./Choice";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    id: "seal-on-ingest",
    label: "Seal on ingest",
    description: "",
    defaultChecked: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByLabelText("Seal on ingest");
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    description: "Every entry gets a hash as it lands, before any operator sees it.",
  },
};

export const Disabled: Story = {
  args: { disabled: true, description: "Fixed by the workspace policy." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Seal on ingest")).toBeDisabled();
  },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true, description: "Fixed by the workspace policy." },
};

/** Several checkboxes under one legend. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ChoiceGroup legend="Notify on">
      <Checkbox id="n1" label="Failed ingest" defaultChecked={true} />
      <Checkbox id="n2" label="Key expiry" defaultChecked={true} />
      <Checkbox id="n3" label="New source" />
      <Checkbox id="n4" label="Seal broken" description="Always on for an admin." disabled={true} defaultChecked={true} />
    </ChoiceGroup>
  ),
};
