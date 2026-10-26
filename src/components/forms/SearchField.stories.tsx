import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SearchField } from "./SearchField";

const meta = {
  title: "Forms/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    id: "search",
    label: "Search the register",
    placeholder: "host, hash or operator",
    shortcut: "",
    dense: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    shortcut: { control: "text" },
    dense: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 340 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Search the register");
    await userEvent.type(input, "a4f9c21e");
    await expect(input).toHaveValue("a4f9c21e");
  },
};

/** The shortcut is decoration: the caller binds the key. */
export const WithShortcut: Story = {
  args: { shortcut: "⌘K" },
};

export const Dense: Story = {
  args: { dense: true, shortcut: "/" },
};

export const WithValue: Story = {
  args: { defaultValue: "registry.example.org", shortcut: "⌘K" },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Search the register")).toBeDisabled();
  },
};
