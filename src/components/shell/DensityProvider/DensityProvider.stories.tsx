import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Plus } from "lucide-react";
import { Button } from "../../actions/Button";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../tables/DataTable";
import { SearchField } from "../../forms/text/SearchField";
import { StatusPill } from "../../status/StatusPill";
import { ChoiceGroup } from "../../forms/choice/ChoiceGroup";
import { Panel, PanelActions } from "../../layout/page/Panel";
import { Stack } from "../../layout/arrange/Stack";
import { Toolbar } from "../../actions/Toolbar";
import { DensityProvider, densityChoices, useDensity, type Density } from "./DensityProvider";

const labels: Record<Density, string> = { comfortable: "Comfortable", compact: "Compact" };

/** A setting anywhere below the provider changes the density through the hook. */
function DensitySetting() {
  const { density, setDensity } = useDensity();
  return (
    <ChoiceGroup
      appearance="segments"
      name="density"
      legend="Density"
      hint="How much space lists and forms take. Saved to your profile."
      value={density}
      onChange={(next: string) => setDensity(next as Density)}
      options={densityChoices.map((value) => ({ value, label: labels[value] }))}
    />
  );
}

const sources = [
  ["registry.example.org", "1,842", "ok", "running"],
  ["feed.example.io", "744", "warn", "paused"],
  ["archive.example.com", "487", "danger", "failed"],
] as const;

/** The app keeps the choice (the person's preference) and hands it to the provider. */
function Sample({ initial }: { initial: Density }) {
  const [density, setDensity] = useState<Density>(initial);
  return (
    <DensityProvider value={density} onChange={setDensity}>
      <Stack gap={16}>
        <Panel title="Display" heading={2}>
          <DensitySetting />
        </Panel>
        <Panel title="Sources" heading={2} padded={false}>
          <PanelActions>
            <Button size="sm">
              <Plus aria-hidden />
              Connect a source
            </Button>
          </PanelActions>
          <DataTable caption="Connected sources" indexed={false}>
            <Toolbar label="Filter the sources" role="search">
              <SearchField id="density-search" label="Search the sources" placeholder="host or kind" size="sm" />
            </Toolbar>
            <TableHead>
              <TableColumn>Host</TableColumn>
              <TableColumn align="end">Entries</TableColumn>
              <TableColumn align="end">State</TableColumn>
            </TableHead>
            <TableBody>
              {sources.map(([host, entries, tone, word]) => (
                <TableRow key={host}>
                  <TableCell>{host}</TableCell>
                  <TableCell align="end" mono>
                    {entries}
                  </TableCell>
                  <TableCell align="end">
                    <StatusPill tone={tone}>{word}</StatusPill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </Panel>
      </Stack>
    </DensityProvider>
  );
}

const meta = {
  title: "Shell/DensityProvider",
  tags: ["layer:pattern"],
  component: DensityProvider,
  args: { value: "comfortable", children: null },
  argTypes: { value: { control: "radio", options: densityChoices }, children: { control: false } },
  render: ({ value = "comfortable" }: ComponentProps<typeof DensityProvider>) => <Sample initial={value} />,
} satisfies Meta<typeof DensityProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const root = () => document.documentElement.getAttribute("data-density");
const rowHeight = (canvas: ReturnType<typeof within>) =>
  canvas.getByRole("row", { name: /registry\.example\.org/ }).getBoundingClientRect().height;

/**
 * The setting where a person makes it, and a list that follows: compact
 * tightens the rows, the toolbar and the gaps; the type stays 14px, and on a
 * touch screen nothing drops below a 40px target.
 */
export const Choice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    await waitFor(() => expect(root()).toBe("comfortable"));
    const before = rowHeight(canvas);
    await userEvent.click(canvas.getByRole("radio", { name: "Compact" }));
    await waitFor(() => expect(root()).toBe("compact"));
    if (!coarse) await expect(rowHeight(canvas)).toBeLessThan(before);
    await expect(getComputedStyle(canvas.getByText("feed.example.io")).fontSize).toBe("14px");
    // The scripted click focuses the radio as a keyboard would; a pointer press leaves no ring.
    (canvasElement.ownerDocument.activeElement as HTMLElement | null)?.blur();
  },
};

/** The person's saved choice arrives as the value. */
export const Compact: Story = {
  args: { value: "compact" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(root()).toBe("compact"));
    await expect(canvas.getByRole("radio", { name: "Compact" })).toBeChecked();
  },
};
