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
import { SkeletonTable } from "./SkeletonTable";
import { StatusPill } from "./StatusPill";

const meta = {
  title: "Primitives/Waiting/Skeleton",
  component: SkeletonTable,
  tags: ["autodocs"],
  args: { rows: 5, label: "Loading the register" },
  argTypes: {
    rows: { control: { type: "number" } },
    label: { control: "text" },
  },
} satisfies Meta<typeof SkeletonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The real grid with its rules drawn, bars for the values. The bars
 * breathe and the frame holds still, so the motion is confined to what
 * is not on record yet. No shimmer sweep.
 */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Loading the register")).toBeInTheDocument();
  },
};

export const Short: Story = {
  args: { rows: 2 },
};

/** Tall enough to read the stagger: the wait runs down the grid. */
export const Long: Story = {
  args: { rows: 12 },
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
