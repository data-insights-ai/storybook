import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Fact, FactList } from "../data/FactList";
import { StatusPill } from "../data/marks/StatusPill";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../data/table/DataTable";
import { Accordion, AccordionDetail, AccordionItem, AccordionMeta } from "./Accordion";

const meta = {
  title: "Layout/Folding/Accordion",
  component: Accordion,
  tags: ["layer:block", "autodocs"],
  args: { label: "Signals by attack phase", children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const phases = [
  {
    id: "TA0001",
    title: "Initial Access",
    range: "Oct 24, 10:30 → Oct 24, 10:42",
    tone: "warn" as const,
    severity: "Medium",
    count: "4 signals",
    facts: [
      ["Techniques", "T1078"],
      ["Devices", "ws-ops-07"],
      ["Accounts", "lena.weiss"],
    ],
    rows: [
      ["2026-10-24 10:42:10", "Sign-in from a new country for lena.weiss."],
      ["2026-10-24 10:30:02", "Sign-in after five failed attempts."],
    ],
  },
  {
    id: "TA0008",
    title: "Lateral Movement",
    range: "Oct 26, 01:30 → Oct 26, 02:00",
    tone: "danger" as const,
    severity: "Critical",
    count: "423 signals",
    facts: [
      ["Techniques", "T1021.002, T1550.002"],
      ["Devices", "ws-ops-07, srv-files-02"],
      ["Accounts", "svc-sync"],
    ],
    rows: [
      ["2026-10-26 01:59:41", "Remote service created on srv-files-02 from ws-ops-07."],
      ["2026-10-26 01:31:12", "Pass-the-hash logon as svc-sync."],
    ],
  },
  {
    id: "TA0010",
    title: "Exfiltration",
    range: "Oct 27, 03:30 → Oct 27, 04:00",
    tone: "danger" as const,
    severity: "Critical",
    count: "180 signals",
    facts: [
      ["Techniques", "T1567.002"],
      ["Devices", "srv-files-02"],
      ["Accounts", "svc-sync"],
    ],
    rows: [["2026-10-27 03:58:20", "Large upload from srv-files-02 to cloud storage."]],
  },
];

function Phases({ label, initiallyOpen = [] }: { label: string; initiallyOpen?: string[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set(initiallyOpen));
  const toggle = (id: string, next: boolean) =>
    setOpen((s) => {
      const copy = new Set(s);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  return (
    <Accordion label={label}>
      {phases.map((p) => (
        <AccordionItem key={p.id} title={p.title} open={open.has(p.id)} onOpenChange={(next) => toggle(p.id, next)}>
          <AccordionDetail>
            {p.id} · {p.range}
          </AccordionDetail>
          <AccordionMeta>
            <StatusPill tone={p.tone}>{p.severity}</StatusPill>
            {p.count}
          </AccordionMeta>
          <FactList layout="columns">
            {p.facts.map(([term, value]) => (
              <Fact key={term} label={term} mono>
                {value}
              </Fact>
            ))}
          </FactList>
          <DataTable caption={`Signals in ${p.title}`} indexed={false} narrow="stack">
            <TableHead>
              <TableColumn>Time</TableColumn>
              <TableColumn>What happened</TableColumn>
            </TableHead>
            <TableBody>
              {p.rows.map(([at, text]) => (
                <TableRow key={at}>
                  <TableCell mono>{at}</TableCell>
                  <TableCell>{text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export const Closed: Story = {
  render: (args) => <Phases label={args.label} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const head = canvas.getByRole("button", { name: /Lateral Movement/ });
    await expect(head).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByRole("region", { name: "Lateral Movement" })).toBeNull();
    await userEvent.click(head);
    await expect(head).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("region", { name: "Lateral Movement" })).toBeVisible();
    await userEvent.click(head);
    await expect(head).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(canvas.queryByRole("region", { name: "Lateral Movement" })).toBeNull());
  },
};

export const OneOpen: Story = {
  render: (args) => <Phases label={args.label} initiallyOpen={["TA0008"]} />,
};
