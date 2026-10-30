import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../../actions/Button";
import { Fact, FactList } from "../../../records/FactList";
import { StatusPill } from "../../../status/StatusPill";
import { SeverityMark } from "../../../status/SeverityMark";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../../tables/DataTable";
import { TextLink } from "../../../text/TextLink";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "../PageHeader";
import { DetailSection } from "../DetailSection";
import { Dialog, DialogFooter } from "../../../overlays/Dialog";
import { Page, PageAside } from "./Page";

const meta = {
  title: "Layout/Page/Page",
  component: Page,
  tags: ["layer:pattern", "autodocs"],
  /* Full-bleed: these stories render the page without the shell, so the frame they show is the page's own. */
  parameters: { layout: "fullscreen" },
  args: { width: "detail", children: null },
  argTypes: {
    width: { control: "radio", options: ["list", "detail", "full", "form"] },
    children: { control: false },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A header, then sections in the section rhythm; the width follows what the
 * page holds. Rendered here without the shell, as an error route outside it
 * would be: the page keeps the shell's frame itself, so nothing runs to the
 * window's edge. Inside `AppShellContent` the shell frames it instead.
 */
export const Detail: Story = {
  render: (args) => (
    <Page {...args}>
      <PageHeader lede="Who it is, what it holds, and what can be changed.">
        <PageHeaderTitle>Northwind Survey</PageHeaderTitle>
        <PageHeaderAside>
          <Button variant="secondary">Open sign-in settings</Button>
        </PageHeaderAside>
      </PageHeader>
      <DetailSection title="General">
        <FactList layout="columns">
          <Fact label="Kind">Customer</Fact>
          <Fact label="Created">3 Mar 2026</Fact>
        </FactList>
      </DetailSection>
      <DetailSection title="Contacts">
        <FactList layout="columns">
          <Fact label="Billing">nora.feld@data-insights.ai</Fact>
        </FactList>
      </DetailSection>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("heading", { level: 1 })).toHaveTextContent("Northwind Survey");
    const page = canvasElement.querySelector(".di-page")!.getBoundingClientRect();
    const title = within(canvasElement).getByRole("heading", { level: 1 }).getBoundingClientRect();
    await expect(title.left - page.left).toBeGreaterThanOrEqual(16);
  },
};

/**
 * A record with what accompanies it. Where the page is 1280px or wider the
 * aside stands in the side column (choose a large viewport); narrower, it
 * follows the sections.
 */
export const WithAside: Story = {
  render: (args) => (
    <Page {...args}>
      <PageHeader lede="What happened, and who works on it.">
        <PageHeaderTitle>Suspicious sign-in on a finance laptop</PageHeaderTitle>
      </PageHeader>
      <DetailSection title="Story">
        <FactList layout="columns">
          <Fact label="Opened">25 Oct 2026, 06:08</Fact>
          <Fact label="Signals">1,043</Fact>
        </FactList>
      </DetailSection>
      <DetailSection title="Findings">
        <FactList layout="columns">
          <Fact label="Credential access">
            <SeverityMark level="high" label="High" />
          </Fact>
        </FactList>
      </DetailSection>
      <PageAside label="Triage">
        <DetailSection title="Triage">
          <FactList layout="columns">
            <Fact label="Assignee">Nora Feld</Fact>
            <Fact label="Status">In progress</Fact>
          </FactList>
        </DetailSection>
      </PageAside>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("complementary", { name: "Triage" })).toBeVisible();
    // Outside the shell there is no bar: the side column sticks 16px under the window's top, not under a bar.
    const side = canvasElement.querySelector<HTMLElement>(".di-page[data-frame='side'] > .di-page-side");
    if (side) await expect(getComputedStyle(side).top).toBe("16px");
  },
};

const sites = [
  { id: "s1", name: "Graz office", seen: "2 min ago", state: "Reporting" },
  { id: "s2", name: "Linz branch", seen: "3 h ago", state: "Silent" },
  { id: "s3", name: "Vienna head office", seen: "just now", state: "Reporting" },
];

function ListWithSheet() {
  const [open, setOpen] = useState<(typeof sites)[number]>();
  return (
    <Page width="list">
      <PageHeader lede="Where the collectors run, and when each last reported.">
        <PageHeaderTitle>Sites</PageHeaderTitle>
      </PageHeader>
      <DataTable caption="Sites">
        <TableHead>
          <TableColumn width="fill">Site</TableColumn>
          <TableColumn>Last seen</TableColumn>
          <TableColumn>State</TableColumn>
        </TableHead>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.id} active={open?.id === site.id} onSelect={() => setOpen(site)}>
              <TableCell>
                <TextLink plain onClick={() => setOpen(site)}>
                  {site.name}
                </TextLink>
              </TableCell>
              <TableCell mono>{site.seen}</TableCell>
              <TableCell>
                <StatusPill tone={site.state === "Silent" ? "warn" : "ok"}>{site.state}</StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
      <Dialog
        open={open !== undefined}
        onClose={() => setOpen(undefined)}
        title={open?.name ?? ""}
        lede={open ? `Last seen ${open.seen}` : undefined}
        closeLabel="Close site"
      >
        <DetailSection title="Collector">
          <FactList layout="columns">
            <Fact label="State">{open?.state}</Fact>
            <Fact label="Version">2.14.0</Fact>
          </FactList>
        </DetailSection>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(undefined)}>
            Done
          </Button>
        </DialogFooter>
      </Dialog>
    </Page>
  );
}

/**
 * A list with the row it has open. Where the page is 1280px or wider (choose
 * a large viewport) the list keeps the side column free and the row's sheet
 * docks there, while Up, Down and Enter keep walking the rows; narrower, the
 * list takes the whole width and the sheet covers it.
 */
export const WithSheet: Story = {
  args: { width: "list" },
  render: () => <ListWithSheet />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Linz branch" }));
    await waitFor(() => expect(canvas.getByRole("heading", { level: 2, name: "Linz branch" })).toBeVisible());
    await userEvent.click(canvas.getByRole("button", { name: "Close site" }));
    await waitFor(() => expect(canvas.queryByRole("heading", { level: 2, name: "Linz branch" })).toBeNull());
  },
};
