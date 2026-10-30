import { useCallback, useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../data/table/DataTable";
import { Stack } from "../../../layout/arrangement/Stack";
import { Panel } from "../../../layout/page/Panel";
import { AppShellBar, AppShellBarEnd } from "../../../shell/AppShell";
import { StatusPill } from "../../../marks/status/StatusPill";
import { RouteProgress } from "../RouteProgress";
import { Loading } from "./Loading";

const meta = {
  title: "Feedback/Waiting/Loading",
  component: Loading,
  tags: ["layer:primitive", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** tells the reader that something is on its way when there is no count to give, in the shape of what is coming.",
          "**When to use:** a short wait for one value or action (`inline`), the application starting before there is a shell (`app`), a page or a table whose data is loading (`list`, `detail`, `form`, `table`). **When not to:** a wait with a count (rows imported, files sent) is `Progress`; a page change inside the shell is `RouteProgress` in the bar plus a page shape here; holding any other content back for the first moments is `Delayed`; a quota such as “1 of 10 seats used” is a `LevelMeter`, not a wait.",
          "**Anatomy:** one status region holding the label, and for `inline` a turning ring before it, for `app` the mark above it; the page and table shapes draw the header, toolbar, table frame, panels or fields they stand in for, with bars where the values will be.",
          "**Variants:** `shape`. `rows` sets the rows of `list` and `table`; `index` keeps the place of a `TableIndex` column; `heading={false}` drops the page header when the layout above already shows it.",
          "**States:** nothing appears for the first `delay` ms (150 by default), while the space is already reserved, so a fast answer neither flashes nor shifts the page. Only the bars and dots breathe; with reduced motion everything stands still.",
          "**Content rules:** the label says what is being waited for, as a short sentence in sentence case: “Loading sources”, “Verifying the manifest”. Not “Please wait”, not an ellipsis.",
          '**Accessibility:** `role="status"` with `aria-live="polite"`; the label is the announced text. In the page and table shapes it is visually hidden and every bar is hidden from assistive technology.',
        ].join("\n\n"),
      },
    },
  },
  args: { label: "Verifying the manifest", shape: "inline", rows: 5, heading: true, index: false, delay: 150 },
  argTypes: {
    label: { control: "text" },
    shape: { control: "inline-radio", options: ["inline", "app", "list", "detail", "form", "table"] },
    rows: { control: { type: "number" } },
    heading: { control: "boolean" },
    index: { control: "boolean" },
    delay: { control: { type: "number" } },
  },
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

const sources = [
  { host: "registry.example.org", state: "ok" as const, word: "Running" },
  { host: "mirror.example.net", state: "ok" as const, word: "Running" },
  { host: "feed.example.io", state: "warn" as const, word: "Paused" },
  { host: "archive.example.com", state: "danger" as const, word: "Failed" },
  { host: "index.example.dev", state: "ok" as const, word: "Running" },
];

/**
 * A table on its way, then arriving. The skeleton is the table's own frame,
 * head and row height, so nothing moves when the values land. Press Reload
 * to run it again.
 */
export const Table: Story = {
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
    return (
      <Stack gap={12}>
        <div>
          <Button variant="secondary" size="sm" onClick={load}>
            Reload
          </Button>
        </div>
        {loading ? (
          <Loading shape="table" label="Loading sources" rows={sources.length} />
        ) : (
          <DataTable caption="Sources">
            <TableHead>
              <TableColumn>Host</TableColumn>
              <TableColumn align="end">State</TableColumn>
            </TableHead>
            <TableBody>
              {sources.map((row) => (
                <TableRow key={row.host}>
                  <TableCell>{row.host}</TableCell>
                  <TableCell align="end">
                    <StatusPill tone={row.state}>{row.word}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        )}
      </Stack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Loading sources")).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole("table", { name: "Sources" })).toBeInTheDocument(), { timeout: 3000 });
  },
};

/** A short wait inside a panel: the ring and the word that says what is pending. */
export const Inline: Story = {
  render: (args) => (
    <Panel title="Manifest">
      <Loading {...args} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Verifying the manifest")).toBeVisible());
  },
};

/**
 * A page change inside the shell: the bar stays, `RouteProgress` fills its
 * rule, and the page's shape holds the content's place until it arrives.
 */
export const PageInTheShell: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack gap={24}>
      <AppShellBar>
        <span>Members</span>
        <AppShellBarEnd moreLabel="More">
          <Button variant="secondary" size="sm">
            Invite
          </Button>
        </AppShellBarEnd>
        <RouteProgress active={true} label="Loading the page" />
      </AppShellBar>
      <Loading shape="list" label="Loading members" rows={6} />
    </Stack>
  ),
};

/** One record: its facts, then a section of prose. */
export const Detail: Story = {
  args: { shape: "detail", label: "Loading the source" },
};

/** A form: labelled fields and the action that commits them. */
export const Form: Story = {
  args: { shape: "form", label: "Loading the settings" },
};

/** A tab of a page: the layout above already shows the header. */
export const InsideALayout: Story = {
  args: { shape: "form", label: "Loading the settings", heading: false },
};

/** A table with a `TableIndex` column keeps the column's place. */
export const TableWithIndex: Story = {
  args: { shape: "table", label: "Loading the register", index: true, rows: 3 },
};

/** The application starting, before there is a shell to keep. */
export const App: Story = {
  parameters: { layout: "fullscreen" },
  args: { shape: "app", label: "Loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Loading")).toBeVisible());
  },
};

/** A long German label wraps under itself, beside the ring, never under it. */
export const German: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("status")).toBeVisible());
  },
  render: () => (
    <Panel title="Manifest">
      <Loading label="Das Manifest der Quelle wird überprüft und mit dem Register abgeglichen" />
    </Panel>
  ),
};
