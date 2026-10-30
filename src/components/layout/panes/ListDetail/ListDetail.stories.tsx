import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SeverityMark, type Severity } from "../../../marks/status/SeverityMark";
import { StatusPill } from "../../../marks/status/StatusPill";
import {
  ListDetail,
  ListDetailBack,
  ListDetailHead,
  ListDetailItem,
  ListDetailItems,
  ListDetailList,
  ListDetailPane,
} from "./ListDetail";

const records: Array<{ n: number; title: string; severity: Severity; word: string; status: string; owner: string }> = [
  { n: 4, title: "Leaked VPN credentials used to move through finance", severity: "critical", word: "Critical", status: "In progress", owner: "Sam Analyst" },
  { n: 7, title: "Unusual sign-ins from a new country", severity: "high", word: "High", status: "Open", owner: "unassigned" },
  { n: 2, title: "Macro document opened on a workstation", severity: "medium", word: "Medium", status: "Open", owner: "unassigned" },
];

function Split({ initial = "list" }: { initial?: "list" | "detail" }) {
  const [open, setOpen] = useState(4);
  const [showing, setShowing] = useState<"list" | "detail">(initial);
  const record = records.find((r) => r.n === open) ?? records[0];
  return (
    <ListDetail showing={showing}>
      <ListDetailList label="Cases">
        <ListDetailHead>
          <span>3 open cases</span>
        </ListDetailHead>
        <ListDetailItems>
          {records.map((r) => (
            <ListDetailItem
              key={r.n}
              title={r.title}
              meta={`Case ${r.n} · ${r.owner}`}
              selected={r.n === open}
              onSelect={() => {
                setOpen(r.n);
                setShowing("detail");
              }}
            >
              <SeverityMark level={r.severity} label={r.word} />
              {r.status === "Open" ? null : <StatusPill tone="neutral">{r.status}</StatusPill>}
            </ListDetailItem>
          ))}
        </ListDetailItems>
      </ListDetailList>
      <ListDetailPane label={`Case ${record.n}`}>
        <ListDetailBack label="All cases" onBack={() => setShowing("list")} />
        <h2>{`Case ${record.n} · ${record.title}`}</h2>
        <p>The record opens here, beside the list, and keeps its place while the list scrolls.</p>
      </ListDetailPane>
    </ListDetail>
  );
}

const meta = {
  title: "Layout/Panes/ListDetail",
  component: ListDetail,
  tags: ["layer:pattern", "autodocs"],
  args: { showing: "list", children: null },
  argTypes: {
    showing: { control: "radio", options: ["list", "detail"] },
    children: { control: false },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ListDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both halves on screen: the list as its own pane, the selected record lifted with the cornflower edge. */
export const Default: Story = {
  globals: { viewport: { value: "wide" } },
  render: () => <Split />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const current = canvas.getByRole("button", { current: true });
    await expect(current).toHaveTextContent("Leaked VPN credentials");
    current.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("button", { name: /Unusual sign-ins/ })).toHaveFocus();
    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("button", { name: /Macro document/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent("Case 2");
  },
};

/** On a phone the halves take turns; the record carries the way back. */
export const PhoneRecord: Story = {
  name: "Phone, record open",
  globals: { viewport: { value: "phone" } },
  render: () => <Split initial="detail" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("region", { name: "Cases" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "All cases" }));
    await expect(canvas.getByRole("region", { name: "Cases" })).toBeVisible();
  },
};
