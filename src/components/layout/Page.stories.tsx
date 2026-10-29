import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../actions/Button";
import { Fact, FactList } from "../data/FactList";
import { StatusPill } from "../data/marks/StatusPill";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../data/table/DataTable";
import { TextLink } from "../navigation/TextLink";
import { PageHeader, PageHeaderAside, PageHeaderTitle } from "./Heading";
import { DetailSection } from "./DetailSection";
import { Sheet, SheetFooter } from "../overlays/Sheet";
import { Page, PageAside } from "./Page";

const meta = {
  title: "Layout/Page/Page",
  component: Page,
  tags: ["layer:pattern", "autodocs"],
  args: { width: "detail", children: null },
  argTypes: {
    width: { control: "radio", options: ["list", "detail", "full", "form"] },
    children: { control: false },
  },
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A header, then sections in the section rhythm; the width follows what the page holds. */
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
  },
};

/**
 * A record with what accompanies it. Where the page is 1280px or wider the
 * aside stands in the side column (choose a large viewport); narrower, it
 * follows the sections.
 */
export const WithAside: Story = {
  parameters: { layout: "fullscreen" },
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
          <Fact label="Credential access">high</Fact>
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
      <Sheet
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
        <SheetFooter>
          <Button variant="secondary" onClick={() => setOpen(undefined)}>
            Done
          </Button>
        </SheetFooter>
      </Sheet>
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
  parameters: { layout: "fullscreen" },
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
