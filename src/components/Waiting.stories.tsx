import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./Button";
import {
  DataTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHead,
  TableIndex,
  TableRow,
} from "./DataTable";
import { SealValue } from "./Seal";
import { StatusPill } from "./StatusPill";
import { Progress, SkeletonTable, Spinner } from "./Waiting";

const meta = {
  title: "Blocks/Waiting",
  component: Progress,
  tags: ["autodocs"],
  args: {
    id: "ingest",
    label: "Ingesting sources",
    count: "1,284 of 4,000",
    value: 32,
    max: 100,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    count: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: { type: "number" } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Waiting is always counted. An endless bar tells an operator nothing. */
export const Counted: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,284 of 4,000")).toBeVisible();
  },
};

export const JustStarted: Story = {
  args: { value: 2, count: "84 of 4,000" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
};

export const NearlyDone: Story = {
  args: { value: 96, count: "3,842 of 4,000" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
};

export const Complete: Story = {
  args: { value: 100, count: "4,000 of 4,000", label: "Ingest complete" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380 }}>
        <Story />
      </div>
    ),
  ],
};

/** The real grid with its rules drawn, bars for the values. No shimmer. */
export const Skeleton: Story = {
  parameters: { controls: { disable: true } },
  render: () => <SkeletonTable rows={5} label="Loading the register" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Loading the register")).toBeInTheDocument();
  },
};

export const SkeletonShort: Story = {
  parameters: { controls: { disable: true } },
  render: () => <SkeletonTable rows={2} label="Loading the register" />,
};

/** For a wait too short to count. It still carries a word. */
export const Turning: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Spinner label="verifying manifest" />
      <Spinner label="resolving hosts" />
    </div>
  ),
};


/**
 * The wait resolving. The skeleton is the real grid with its rules and its
 * index column already drawn, so nothing jumps when the values land — the
 * bars are replaced in place, and no layout moves.
 *
 * Press Reload to run it again.
 */
export const Resolving: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [loading, setLoading] = useState(true);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const load = useCallback(() => {
      setLoading(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setLoading(false), 1400);
    }, []);

    useEffect(() => {
      load();
      return () => clearTimeout(timer.current);
    }, [load]);

    const rows = [
      { ordinal: "01", host: "registry.example.org", hash: "a4f9c21e", state: "ok" as const, label: "running" },
      { ordinal: "02", host: "mirror.example.net", hash: "7f3a99e0", state: "ok" as const, label: "running" },
      { ordinal: "03", host: "feed.example.io", hash: "c18b70d4", state: "warn" as const, label: "paused" },
      { ordinal: "04", host: "archive.example.com", hash: "", state: "danger" as const, label: "failed" },
      { ordinal: "05", host: "index.example.dev", hash: "b207ff6c", state: "ok" as const, label: "running" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <Button variant="secondary" size="dense" onClick={load}>
            Reload
          </Button>
        </div>
        {loading ? (
          <SkeletonTable rows={5} label="Loading the register" />
        ) : (
          <DataTable caption="Sources on record">
            <TableHead>
              <TableColumn index={true}>Ordinal</TableColumn>
              <TableColumn>Host</TableColumn>
              <TableColumn>Manifest</TableColumn>
              <TableColumn align="end">State</TableColumn>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.ordinal} tone={row.state === "danger" ? "danger" : "default"}>
                  <TableIndex>{row.ordinal}</TableIndex>
                  <TableCell>{row.host}</TableCell>
                  <TableCell>
                    <SealValue
                      state={row.hash === "" ? "absent" : "sealed"}
                      stateLabel={row.hash === "" ? "Not recorded" : "Sealed"}
                    >
                      {row.hash === "" ? "none" : row.hash}
                    </SealValue>
                  </TableCell>
                  <TableCell align="end">
                    <StatusPill tone={row.state}>{row.label}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        )}
      </div>
    );
  },
};

/**
 * A counted wait actually counting. The bar and the number move together,
 * because the bar alone does not say how much is left.
 */
export const Counting: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const total = 4000;
    const [done, setDone] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval>>(undefined);

    const run = useCallback(() => {
      setDone(0);
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        setDone((value) => {
          const next = value + 137;
          if (next >= total) {
            clearInterval(timer.current);
            return total;
          }
          return next;
        });
      }, 90);
    }, []);

    useEffect(() => {
      run();
      return () => clearInterval(timer.current);
    }, [run]);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 380 }}>
        <Progress
          id="counting"
          label={done === total ? "Ingest complete" : "Ingesting sources"}
          count={`${done.toLocaleString("en")} of ${total.toLocaleString("en")}`}
          value={(done / total) * 100}
        />
        <div>
          <Button variant="secondary" size="dense" onClick={run}>
            Run again
          </Button>
        </div>
      </div>
    );
  },
};
