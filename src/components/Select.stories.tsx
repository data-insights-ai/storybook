import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    id: "window",
    label: "Window",
    hint: "",
    error: "",
    mono: true,
    disabled: false,
    children: null,
    required: false,
    defaultValue: "24h",
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    mono: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false },
  },
  render: (args) => (
    <Select {...args}>
      <option value="1h">last hour</option>
      <option value="24h">last 24 hours</option>
      <option value="7d">last 7 days</option>
      <option value="30d">last 30 days</option>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Window");
    await userEvent.selectOptions(select, "7d");
    await expect(select).toHaveValue("7d");
  },
};

export const WithHint: Story = {
  args: { hint: "Relative to the last seal, not to now." },
};

export const WithError: Story = {
  args: { error: "This window holds no sealed entries." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toHaveAttribute("aria-invalid", "true");
  },
};

/** A select holding words rather than a range. */
export const Prose: Story = {
  args: { id: "role", label: "Role", mono: false, defaultValue: "operator" },
  render: (args) => (
    <Select {...args}>
      <option value="operator">Operator</option>
      <option value="auditor">Auditor</option>
      <option value="admin">Admin</option>
    </Select>
  ),
};

export const Required: Story = {
  args: { required: true, hint: "Required." },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toBeDisabled();
  },
};
