import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SeverityMark, type Severity } from "../../../marks/status/SeverityMark";
import { StatusPill } from "../../../marks/status/StatusPill";
import { PageHeader, PageHeaderTitle } from "../../page/PageHeader";
import { Button } from "../../../actions/Button";
import { Fact, FactList } from "../../../data/records/FactList";
import { Toolbar } from "../../../actions/Toolbar";
import { Stack } from "../../arrangement/Stack";
import { Panel } from "../../page/Panel";
import { Select } from "../../../forms/select/Select";
import { Split, SplitAside, SplitMain } from "./Split";
import { SplitBack, SplitList, SplitListHead, SplitListItem, SplitListItems } from "./SplitList";

/**
 * Two panes side by side: what is read, and what stays beside it.
 *
 * - **Use it** for a record beside the decisions about it (`rail`), a form
 *   beside the live result of what it edits (`preview`), and triage through
 *   many records with the open one beside the list (`list`).
 * - **Not** for a record's companion on a detail page (`Page` with
 *   `PageAside`), for a record opened from a table row (`Dialog`), or for
 *   columns of equal blocks (`Grid`).
 *
 * Anatomy: `SplitMain` and `SplitAside`; in a `list` split, `SplitList`
 * (`SplitListHead`, `SplitListItems` of `SplitListItem`) and `SplitMain`
 * with a `label` and a `SplitBack`. States: on a narrow screen the rail
 * and the preview follow the main column (`asideFirst` puts the rail
 * first); the list halves take turns by `showing`. Keyboard: in the list,
 * Up and Down move between items, Home and End to the ends; the current
 * item is announced as current, and focus follows a swap on a phone.
 */

const meta = {
  title: "Layout/Panes/Split",
  component: Split,
  tags: ["layer:pattern", "autodocs"],
  args: { asideFirst: false, children: null },
  argTypes: { children: { control: false } },
  render: (args) => (
    <Split {...args}>
      <SplitMain>
        <Panel title="What happened" padded>
          <p>
            An account signed in to a workstation from a public address, ran domain discovery, then signed in as local
            administrator on two servers and started a remote service on each.
          </p>
        </Panel>
        <Panel title="Affected" padded>
          <FactList layout="columns">
            <Fact label="Devices">3</Fact>
            <Fact label="Accounts">1</Fact>
          </FactList>
        </Panel>
      </SplitMain>
      <SplitAside label="Decide">
        <Panel title="Decide" padded>
          <Stack gap={12}>
            <Select id="split-status" label="Status" mono={false} value="in_progress" onChange={() => {}}>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
            </Select>
            <Toolbar align="end">
              <Button>Save</Button>
            </Toolbar>
          </Stack>
        </Panel>
      </SplitAside>
    </Split>
  ),
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The story on the left, the decisions in a rail that stays in view. */
export const Record: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aside = canvas.getByRole("complementary", { name: "Decide" });
    await expect(aside).toBeVisible();
    for (const card of Array.from(aside.children)) {
      await expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight + 1);
    }
  },
};

/** On a phone the decisions come first when they must not be missed. */
export const AsideFirst: Story = { args: { asideFirst: true } };

/**
 * A form beside the live result of what it edits: from 1280px the preview is
 * a wide column that stays in view while the form scrolls; narrower, it
 * follows the form.
 */
export const Preview: Story = {
  args: { variant: "preview" },
  render: (args) => (
    <Split {...args}>
      <SplitMain>
        {["Event time", "Severity", "Source address", "Account", "Device", "Action"].map((label) => (
          <Panel key={label} title={label} padded>
            <Select id={`split-preview-${label}`} label="From" mono={false} value="a" onChange={() => {}}>
              <option value="a">The recorded value</option>
              <option value="b">A fixed value</option>
            </Select>
          </Panel>
        ))}
      </SplitMain>
      <SplitAside label="Preview">
        <Panel title="Preview" padded>
          <pre
            style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontFamily: "var(--di-font-code)" }}
          >
            {'{"time":"2026-10-23T09:14:02Z","severity":"high","src":"203.0.113.7","user":"nora.feld"}'}
          </pre>
        </Panel>
      </SplitAside>
    </Split>
  ),
  play: async ({ canvasElement }) => {
    const aside = within(canvasElement).getByRole("complementary", { name: "Preview" });
    await expect(aside).toBeVisible();
    const sticky = getComputedStyle(aside).position === "sticky";
    await expect(sticky).toBe(window.innerWidth >= 1280);
  },
};

const records: Array<{ n: number; title: string; severity: Severity; word: string; status: string; owner: string }> = [
  {
    n: 4,
    title: "Leaked VPN credentials used to move through finance",
    severity: "critical",
    word: "Critical",
    status: "In progress",
    owner: "Sam Analyst",
  },
  {
    n: 7,
    title: "Unusual sign-ins from a new country",
    severity: "high",
    word: "High",
    status: "Open",
    owner: "unassigned",
  },
  {
    n: 2,
    title: "Macro document opened on a workstation",
    severity: "medium",
    word: "Medium",
    status: "Open",
    owner: "unassigned",
  },
];

function Cases({ initial = "list" }: { initial?: "list" | "detail" }) {
  const [open, setOpen] = useState(4);
  const [showing, setShowing] = useState<"list" | "detail">(initial);
  const record = records.find((r) => r.n === open) ?? records[0];
  return (
    <Split variant="list" showing={showing}>
      <SplitList label="Cases">
        <SplitListHead>
          <span>3 open cases</span>
        </SplitListHead>
        <SplitListItems>
          {records.map((r) => (
            <SplitListItem
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
            </SplitListItem>
          ))}
        </SplitListItems>
      </SplitList>
      <SplitMain label={`Case ${record.n}`}>
        <SplitBack label="All cases" onBack={() => setShowing("list")} />
        <PageHeader
          level={2}
          eyebrow={`Case ${record.n}`}
          lede={record.owner === "unassigned" ? "Not assigned yet" : `Assigned to ${record.owner}`}
        >
          <PageHeaderTitle>{record.title}</PageHeaderTitle>
        </PageHeader>
        <Panel title="What happened">
          <FactList layout="columns">
            <Fact label="Severity">
              <SeverityMark level={record.severity} label={record.word} />
            </Fact>
            <Fact label="Status">{record.status}</Fact>
          </FactList>
        </Panel>
      </SplitMain>
    </Split>
  );
}

/** Triage: the list as its own pane, the open record beside it, the current item with the cornflower edge. */
export const List: Story = {
  globals: { viewport: { value: "wide" } },
  render: () => <Cases />,
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
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent("Macro document opened on a workstation");
  },
};

/** On a phone the halves take turns; the record carries the way back. */
export const ListPhoneRecord: Story = {
  name: "List, phone, record open",
  globals: { viewport: { value: "phone" } },
  render: () => <Cases initial="detail" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("region", { name: "Cases" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "All cases" }));
    await expect(canvas.getByRole("region", { name: "Cases" })).toBeVisible();
  },
};

/** On a phone focus follows the swap: into the record, and back to the item it came from. */
export const ListPhoneFocus: Story = {
  name: "List, phone, focus follows",
  globals: { viewport: { value: "phone" } },
  render: () => <Cases />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Unusual sign-ins/ }));
    await expect(document.activeElement).toBe(canvas.getByRole("region", { name: "Case 7" }));
    await userEvent.click(canvas.getByRole("button", { name: "All cases" }));
    await expect(document.activeElement).toBe(canvas.getByRole("button", { name: /Unusual sign-ins/ }));
  },
};

/** `SplitListHead` sits above the items even when it is written after them, on the items' text edge. */
export const ListHeadWrittenLast: Story = {
  globals: { viewport: { value: "wide" } },
  render: () => (
    <Split variant="list">
      <SplitList label="Cases">
        <SplitListItems>
          <SplitListItem title="Port scan from a workstation" meta="Case 3" selected onSelect={() => {}} />
        </SplitListItems>
        <SplitListHead>
          <span>1 open case</span>
        </SplitListHead>
      </SplitList>
      <SplitMain label="Case 3">
        <Panel title="Port scan from a workstation">
          <p>A workstation probed 1,024 ports on two servers within a minute.</p>
        </Panel>
      </SplitMain>
    </Split>
  ),
  play: async ({ canvasElement }) => {
    const head = canvasElement.querySelector(".di-split-list-head")!.getBoundingClientRect();
    const items = canvasElement.querySelector(".di-split-items")!.getBoundingClientRect();
    await expect(head.bottom).toBeLessThanOrEqual(items.top + 1);
    const title = canvasElement.querySelector(".di-split-item-title")!.getBoundingClientRect();
    const text = canvasElement.querySelector(".di-split-list-head > span")!.getBoundingClientRect();
    await expect(Math.abs(title.left - text.left)).toBeLessThanOrEqual(1);
  },
};
