import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { ListToolbar, ListToolbarEnd } from "./ListToolbar";
import { SearchField } from "../../forms/SearchField";
import { Select } from "../../forms/Select";
import { useShortcut } from "../../navigation/shortcuts/useShortcut";

const meta = {
  title: "Data/Table/ListToolbar",
  component: ListToolbar,
  tags: ["layer:block", "autodocs"],
  args: { label: "Filter members", sticky: false, children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ListToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Toolbar(args: { label: string; sticky?: boolean }) {
  const search = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  useShortcut("/", () => search.current?.focus());
  return (
    <ListToolbar {...args}>
      <SearchField
        ref={search}
        id="members-search"
        label="Search members"
        placeholder="Name or email"
        shortcut="/"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Select id="members-role" label="Role" hideLabel mono={false} defaultValue="">
        <option value="">All roles</option>
        <option value="owner">Owners</option>
        <option value="admin">Administrators</option>
      </Select>
      <Select id="members-seat" label="Seat" hideLabel mono={false} defaultValue="">
        <option value="">Any seat</option>
        <option value="assigned">With a seat</option>
        <option value="none">Without a seat</option>
      </Select>
      <ListToolbarEnd>
        <Button variant="secondary">
          <Download aria-hidden />
          Export CSV
        </Button>
      </ListToolbarEnd>
    </ListToolbar>
  );
}

/** Search grows, filters fit their options, list-wide actions at the end. `/` focuses the search (`useShortcut`). */
export const Members: Story = {
  render: (args) => <Toolbar {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("search", { name: "Filter members" })).toBeVisible();
    await userEvent.click(canvasElement);
    await userEvent.keyboard("/");
    await waitFor(() => expect(canvas.getByLabelText("Search members")).toHaveFocus());
  },
};
