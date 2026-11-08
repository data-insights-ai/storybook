import type { Meta, StoryObj } from "@storybook/react-vite";
import { onPanel } from "../../../../../.storybook/onPanel";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { FilterSelect } from "./FilterSelect";

const roles = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Administrator" },
  { value: "member", label: "Member" },
] as const;

const meta = {
  title: "Forms/Select/FilterSelect",
  component: FilterSelect,
  tags: ["layer:block", "autodocs"],
  decorators: [onPanel("Members")],
  args: { id: "role", label: "Role", all: "All roles", value: "", options: roles, onChange: () => undefined },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Its first option names the filter and shows everything; in the bar the label is read, not shown. */
export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string>("");
    return <FilterSelect {...args} value={value} onChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole("combobox", { name: "Role" });
    await expect(select).toHaveValue("");
    await userEvent.selectOptions(select, "admin");
    await expect(select).toHaveValue("admin");
  },
};

/** In the filter sheet the label shows, and the copy takes its own id. */
export const InTheSheet: Story = {
  args: { place: "sheet" },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("#role-sheet")).not.toBeNull();
    await expect(within(canvasElement).getByText("Role")).toBeVisible();
  },
};
