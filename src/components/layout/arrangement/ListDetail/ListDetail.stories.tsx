import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SeverityMark, type Severity } from "../../../marks/SeverityMark";
import { ListDetail, ListDetailBack, ListDetailHead, ListDetailItem, ListDetailList, ListDetailPane } from "./ListDetail";

const meta = {
  title: "Layout/Arrangement/ListDetail",
  component: ListDetail,
  tags: ["layer:pattern", "autodocs", "direction:a"],
  parameters: { direction: "a" },
  args: { showing: "list", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ListDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

const records: { id: string; title: string; severity: Severity; label: string }[] = [
  { id: "4", title: "Lateral movement from ws-fin-014", severity: "critical", label: "Critical" },
  { id: "2", title: "Defender exclusion on ws-hr-007", severity: "high", label: "High" },
  { id: "3", title: "Port scan from ws-dev-031", severity: "medium", label: "Medium" },
];

function Sample() {
  const [open, setOpen] = useState("4");
  const [showing, setShowing] = useState<"list" | "detail">("list");
  const record = records.find((r) => r.id === open)!;
  return (
    <ListDetail showing={showing}>
      <ListDetailList label="Cases">
        <ListDetailHead>3 open cases</ListDetailHead>
        {records.map((r) => (
          <ListDetailItem
            key={r.id}
            title={r.title}
            meta={`Case ${r.id}`}
            selected={r.id === open}
            onSelect={() => {
              setOpen(r.id);
              setShowing("detail");
            }}
          >
            <SeverityMark level={r.severity} label={r.label} />
          </ListDetailItem>
        ))}
      </ListDetailList>
      <ListDetailPane label={`Case ${record.id}`}>
        <ListDetailBack label="All cases" onBack={() => setShowing("list")} />
        <h2>{record.title}</h2>
        <p>The open record stays beside the list.</p>
      </ListDetailPane>
    </ListDetail>
  );
}

export const Default: Story = {
  render: () => <Sample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("button", { name: /ws-fin-014/ });
    await expect(first).toHaveAttribute("aria-current", "true");
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("button", { name: /ws-hr-007/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button", { name: /ws-hr-007/ })).toHaveAttribute("aria-current", "true");
  },
};
