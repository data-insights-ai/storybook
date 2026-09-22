import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "./SearchField";

const meta = {
  title: "Components/SearchField",
  component: SearchField,
  tags: ["autodocs"],
  args: {
    label: "Search sources",
    placeholder: "Search sources, platforms, or types…",
    type: "search",
    disabled: false,
    readOnly: false,
    required: false,
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
