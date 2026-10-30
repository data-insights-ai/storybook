import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SearchField } from "./SearchField";

const meta = {
  title: "Forms/Text/SearchField",
  component: SearchField,
  tags: ["layer:form", "autodocs"],
  args: {
    id: "search",
    label: "Search the register",
    placeholder: "Host, hash or operator",
    shortcut: "/",
    size: "md",
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    placeholder: { control: "text" },
    shortcut: { control: "text" },
    size: { control: "radio", options: ["sm", "md"] },
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
    // The key is the one every control carries: a tone of the ink, no frame of its own inside the field's frame.
    const key = canvasElement.querySelector(".di-search-kbd")!;
    await expect(key).toHaveClass("di-kbd-on-control");
    await expect(getComputedStyle(key).borderTopColor).toBe("rgba(0, 0, 0, 0)");
  },
};

/** A search inside a picker or a sheet, not the page’s own: it shows no key, since only the page’s search answers `/`. */
export const WithoutShortcut: Story = {
  args: { shortcut: "", placeholder: "Filter members" },
};

/** Beside small buttons in a toolbar. */
export const Small: Story = {
  args: { size: "sm" },
};

export const WithValue: Story = {
  args: { defaultValue: "registry.example.org" },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Search the register")).toBeDisabled();
  },
};
