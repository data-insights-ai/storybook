import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Checkbox } from "../../../forms/choice/Checkbox";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../data/table/DataTable";
import { SeverityMark, type Severity } from "../../../marks/status/SeverityMark";
import { Panel } from "../../page/Panel";
import { Stack } from "../../arrangement/Stack";
import { Disclosure, DisclosureDetail, DisclosureGroup, DisclosureLead, DisclosureMeta } from "./Disclosure";

/**
 * A group that folds away: a button with `aria-expanded` controlling the
 * region under it.
 *
 * - **Use it** for groups a reader opens on demand: signals by attack phase,
 *   a filter group chosen as a whole, the detail behind a summary row.
 * - **Not** for views of one record (`Tabs`), for a record beside its list
 *   (`Split variant="list"`), or for one hidden explanation in running text
 *   (a `TextLink` to it).
 *
 * Anatomy: the head (the `title` or a `DisclosureLead`, a `DisclosureDetail`
 * under it, a `DisclosureMeta` at its end, the chevron), then the body.
 * `toggle="head"` makes the whole head the button; `toggle="chevron"` keeps
 * the chevron as the only button, so the lead can hold a checkbox.
 * Several go in a `DisclosureGroup`; with `single` one is open at a time.
 *
 * Content: the title names the group in a few words; the detail is a code
 * or a range; the meta is a count and the worst state, a `SeverityMark` for
 * severity. Keyboard: Tab reaches the toggle, Enter and Space fold it; a
 * screen reader hears the name and "expanded" or "collapsed", and the open
 * body is a region named by the title.
 */
const meta = {
  title: "Layout/Folding/Disclosure",
  component: Disclosure,
  tags: ["layer:block", "autodocs"],
  args: { toggle: "head", title: "Lateral Movement" },
  argTypes: {
    toggle: { control: "radio", options: ["head", "chevron"] },
    children: { control: false },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

const phases: Array<{
  id: string;
  title: string;
  range: string;
  severity: Severity;
  word: string;
  count: string;
  rows: Array<[at: string, technique: string, device: string, text: string]>;
}> = [
  {
    id: "TA0001",
    title: "Initial Access",
    range: "Oct 24, 10:30 → 10:42",
    severity: "medium",
    word: "Medium",
    count: "4 signals",
    rows: [
      ["2026-10-24 10:42:10", "T1078", "ws-ops-07", "Sign-in from a new country for lena.weiss."],
      ["2026-10-24 10:30:02", "T1078", "ws-ops-07", "Sign-in after five failed attempts."],
    ],
  },
  {
    id: "TA0008",
    title: "Lateral Movement",
    range: "Oct 26, 01:30 → 02:00",
    severity: "critical",
    word: "Critical",
    count: "423 signals",
    rows: [
      ["2026-10-26 01:59:41", "T1021.002", "srv-files-02", "Remote service created from ws-ops-07."],
      ["2026-10-26 01:31:12", "T1550.002", "ws-ops-07", "Pass-the-hash logon as svc-sync."],
    ],
  },
  {
    id: "TA0010",
    title: "Exfiltration",
    range: "Oct 27, 03:30 → 04:00",
    severity: "critical",
    word: "Critical",
    count: "180 signals",
    rows: [["2026-10-27 03:58:20", "T1567.002", "srv-files-02", "Large upload to cloud storage as svc-sync."]],
  },
];

function Phases({ open = "TA0008", titles }: { open?: string; titles?: Record<string, string> }) {
  return (
    <Panel title="Signals by attack phase" heading={2}>
      <DisclosureGroup label="Signals by attack phase" single>
        {phases.map((p) => (
          <Disclosure key={p.id} id={p.id} toggle="head" title={titles?.[p.id] ?? p.title} defaultOpen={p.id === open}>
            <DisclosureDetail>
              {p.id} · {p.range}
            </DisclosureDetail>
            <DisclosureMeta>
              <SeverityMark level={p.severity} label={p.word} />
              {p.count}
            </DisclosureMeta>
            <DataTable caption={`Signals in ${p.title}`} indexed={false} narrow="stack">
              <TableHead>
                <TableColumn>Time</TableColumn>
                <TableColumn>Technique</TableColumn>
                <TableColumn>Device</TableColumn>
                <TableColumn width="fill">What happened</TableColumn>
              </TableHead>
              <TableBody>
                {p.rows.map(([at, technique, device, text]) => (
                  <TableRow key={at}>
                    <TableCell mono>{at}</TableCell>
                    <TableCell mono>{technique}</TableCell>
                    <TableCell mono>{device}</TableCell>
                    <TableCell>{text}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </Disclosure>
        ))}
      </DisclosureGroup>
    </Panel>
  );
}

/**
 * Signals grouped by attack phase: the whole head is the toggle, one phase
 * open at a time. The open phase is one object: the head and its signals
 * share the group's tone, its inset and the title's left edge, and the
 * signals sit one inset under the head. The signals are one table, so the
 * technique, the device and the time line up in one set of columns under
 * one label style.
 */
export const AttackPhases: Story = {
  render: () => <Phases />,
  play: async ({ canvasElement }) => {
    const open = canvasElement.querySelector<HTMLElement>(".di-disclosure.is-open")!;
    const title = open.querySelector(".di-disclosure-title")!.getBoundingClientRect();
    const head = open.querySelector(".di-disclosure-head")!.getBoundingClientRect();
    const table = open.querySelector(".di-disclosure-body")!.firstElementChild!.getBoundingClientRect();
    const tile = getComputedStyle(open);
    const firstCell = open.querySelector<HTMLElement>("th, td")!;
    const textEdge = firstCell.getBoundingClientRect().left + parseFloat(getComputedStyle(firstCell).paddingLeft);
    await expect(Math.abs(textEdge - title.left)).toBeLessThanOrEqual(1);
    await expect(Math.abs(table.top - head.bottom - parseFloat(tile.paddingTop))).toBeLessThanOrEqual(1);
    const word = within(open).getByText("Critical");
    await expect(Number(getComputedStyle(word).fontWeight)).toBeLessThan(600);
  },
};

/** Opening one phase folds the one that was open. */
export const OneOpenAtATime: Story = {
  render: () => <Phases />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lateral = canvas.getByRole("button", { name: /Lateral Movement/ });
    const exfil = canvas.getByRole("button", { name: /Exfiltration/ });
    await expect(lateral).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("region", { name: "Lateral Movement" })).toBeVisible();
    await userEvent.click(exfil);
    await expect(exfil).toHaveAttribute("aria-expanded", "true");
    await expect(lateral).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(canvas.queryByRole("region", { name: "Lateral Movement" })).toBeNull());
  },
};

function Choices() {
  const [open, setOpen] = useState(true);
  const [chosen, setChosen] = useState(["Granted"]);
  const all = ["Granted", "Revoked", "Role changed"];
  const toggle = (k: string) => setChosen((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]));
  return (
    <Panel title="Events to show">
      <Disclosure id="access" open={open} onOpenChange={setOpen} toggleLabel="Show access events">
        <DisclosureLead>
          <Checkbox
            id="access-all"
            label="Access"
            checked={chosen.length === all.length}
            indeterminate={chosen.length > 0 && chosen.length < all.length}
            onChange={() => setChosen(chosen.length === all.length ? [] : all)}
          />
        </DisclosureLead>
        <DisclosureMeta>
          {chosen.length} of {all.length}
        </DisclosureMeta>
        <Stack gap={8}>
          {all.map((k) => (
            <Checkbox key={k} id={k} label={k} checked={chosen.includes(k)} onChange={() => toggle(k)} />
          ))}
        </Stack>
      </Disclosure>
    </Panel>
  );
}

/** A filter group chosen as a whole: the checkbox heads it, so the chevron is the only toggle. */
export const GroupOfChoices: Story = {
  render: () => <Choices />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Show access events" });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(canvas.getByLabelText("Access"));
    await expect(canvas.getByText("3 of 3")).toBeVisible();
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(canvas.getByText("Revoked")).not.toBeVisible());
    await userEvent.click(toggle);
    await expect(canvas.getByText("Revoked")).toBeVisible();
  },
};

/** Folded, the body is out of reach: Tab goes from one head to the next. */
export const Closed: Story = {
  render: () => <Phases open="" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("button", { name: /Initial Access/ });
    first.focus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: /Lateral Movement/ })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button", { name: /Lateral Movement/ })).toHaveAttribute("aria-expanded", "true");
  },
};

/** Long German titles wrap inside the head; on a phone the meta moves under them. */
export const LongTitles: Story = {
  render: () => (
    <Phases
      titles={{
        TA0001: "Erstzugriff über kompromittierte Zugangsdaten",
        TA0008: "Seitliche Ausbreitung im Netzwerk der Finanzabteilung",
        TA0010: "Datenabfluss in einen Cloud-Speicher",
      }}
    />
  ),
};
