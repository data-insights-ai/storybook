import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";

const meta = {
  title: "Forms/Select/Select",
  component: Select,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "window",
    label: "Window",
    hint: "",
    hintTone: "neutral",
    labelTrack: "record",
    mono: false,
    disabled: false,
    children: null,
    required: false,
    defaultValue: "24h",
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    hintTone: { control: "radio", options: ["neutral", "sealed", "error"] },
    labelTrack: { control: "radio", options: ["record", "prose"] },
    mono: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Select {...args}>
      <option value="1h">Last hour</option>
      <option value="24h">Last 24 hours</option>
      <option value="7d">Last 7 days</option>
      <option value="30d">Last 30 days</option>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toHaveValue("24h");
  },
};

/** Choosing another window. The native select does the work. */
export const Choosing: Story = {
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
  args: { hint: "This window holds no sealed entries.", hintTone: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toHaveAttribute("aria-invalid", "true");
  },
};

/** Roles: a select of words in the UI track, as every select is unless its options are identifiers. */
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
  args: { required: true, hint: "The audit export covers this window." },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toBeRequired();
    await expect(canvasElement.querySelector(".di-field-label.is-required")).not.toBeNull();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Window")).toBeDisabled();
  },
};

/** The prose label, for a select on a form rather than over a register. */
export const ProseLabel: Story = {
  name: "Prose label",
  args: { label: "How should we reach you?", labelTrack: "prose", mono: false, defaultValue: "email" },
  render: (args) => (
    <Select {...args}>
      <option value="email">Email</option>
      <option value="webhook">Webhook</option>
      <option value="none">Nothing, I will check myself</option>
    </Select>
  ),
};

export const HiddenLabel: Story = {
  name: "Hidden label (in a table row)",
  args: { id: "role-nora", label: "Role of Nora Feld", hideLabel: true, mono: false, defaultValue: "operator" },
  render: (args) => (
    <Select {...args}>
      <option value="operator">Operator</option>
      <option value="auditor">Auditor</option>
    </Select>
  ),
};

/**
 * Options under headings, one of them unavailable. Opened with a mouse or a
 * trackpad, the list is drawn like a ComboBox's where the browser allows it;
 * a phone shows its own picker.
 */
export const Grouped: Story = {
  args: { id: "grant", label: "Grant", mono: false, defaultValue: "operator" },
  render: (args) => (
    <Select {...args}>
      <optgroup label="Roles">
        <option value="operator">Operator</option>
        <option value="auditor">Auditor</option>
      </optgroup>
      <optgroup label="Single permission">
        <option value="cases.read">Read cases</option>
        <option value="cases.delete" disabled>
          Delete cases
        </option>
      </optgroup>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("option", { name: "Delete cases" })).toBeDisabled();
  },
};
