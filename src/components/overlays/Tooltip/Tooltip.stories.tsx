import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeCheck, Download, FileText, Gauge, RefreshCw, ShieldAlert } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { Panel, PanelActions, PanelMeta } from "../../layout/page/Panel";
import { Page } from "../../layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { DataTable, TableBody, TableCell, TableColumn, TableHead, TableRow } from "../../tables/DataTable";
import { StatusPill } from "../../status/StatusPill";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../../navigation/Sidebar";
import { Tooltip } from "./Tooltip";

/**
 * A short label for a control that has none.
 *
 * - **Use it** to name an icon-only button, a collapsed navigation item, or
 *   (through `TooltipTarget`) a code or abbreviation in running text.
 * - **Not** for a fact a reader needs (write it on the screen, or use
 *   `FactList`), for an explanation (`Notice` or a `PanelNote`), or for a
 *   value at a point of a chart (the chart's own readout).
 *
 * Anatomy: the trigger it wraps, then the label in a navy bubble, with an
 * optional count (`badge`). Content: the control's name in a word or three,
 * the same words as its `aria-label`; no sentence, no punctuation.
 * Accessibility: it opens on hover and on keyboard focus and closes on
 * Escape; the trigger keeps its own accessible name, so a screen reader
 * hears the control, not the tooltip.
 */
const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["layer:block", "autodocs"],
  args: { label: "Export as CSV", side: "top", children: <span /> },
  argTypes: {
    side: { control: "radio", options: ["top", "right", "bottom", "left"] },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const sources = [
  ["feed.example.io", "running"],
  ["beta.example.dev", "paused"],
  ["archive.example.net", "running"],
] as const;

/**
 * Where the bubble sits, measured: its arrow is on the trigger centre, the
 * bubble is centred on the trigger or lined up with the trigger edge on the
 * side where a centred bubble had no room, and it keeps 8px from every
 * window edge. It covers neither its trigger nor the given neighbours.
 */
async function expectPlaced(trigger: HTMLElement, label: string, neighbours: HTMLElement[] = []) {
  await userEvent.hover(trigger);
  const body = within(trigger.ownerDocument.body);
  const tip = await waitFor(() => body.getByText(label, { selector: ".di-tooltip" }));
  await waitFor(() => expect(tip).toBeVisible());
  await waitFor(() => expect(tip.getAnimations().length).toBe(0));
  const box = tip.getBoundingClientRect();
  const at = trigger.getBoundingClientRect();
  const arrow = tip.querySelector(".di-tooltip-arrow")!.getBoundingClientRect();
  const centre = (r: DOMRect) => r.left + r.width / 2;
  await expect(Math.abs(centre(arrow) - centre(at))).toBeLessThanOrEqual(4);
  const placement = {
    center: Math.abs(centre(box) - centre(at)) <= 4,
    start: Math.abs(box.left - at.left) <= 1,
    end: Math.abs(box.right - at.right) <= 1,
  };
  await expect(placement[tip.dataset.align as keyof typeof placement]).toBe(true);
  const view = trigger.ownerDocument.documentElement;
  await expect(box.left).toBeGreaterThanOrEqual(8);
  await expect(box.right).toBeLessThanOrEqual(view.clientWidth - 8);
  await expect(box.top).toBeGreaterThanOrEqual(8);
  await expect(box.bottom).toBeLessThanOrEqual(view.clientHeight - 8);
  const overlaps = (r: DOMRect) => box.left < r.right && box.right > r.left && box.top < r.bottom && box.bottom > r.top;
  await expect([trigger, ...neighbours].map((el) => overlaps(el.getBoundingClientRect()))).toEqual(
    [trigger, ...neighbours].map(() => false),
  );
  return tip;
}

/**
 * The icon actions in a panel head name themselves on hover and on focus.
 * Both are the same quiet icon button, centred on the title line, and the
 * count is the head meta. The tooltip is centred on its button with its
 * arrow on the button; on a phone, where the button sits near the window
 * edge, it lines up with the button end instead. A pointer hover shows no
 * focus ring.
 */
export const OnAnIconButton: Story = {
  render: (args) => (
    <Page>
      <PageHeader>
        <PageHeaderTitle>Collection</PageHeaderTitle>
      </PageHeader>
      <Panel title="Sources" heading={2} padded={false}>
        <PanelMeta>12 sources</PanelMeta>
        <PanelActions>
          <Tooltip label="Refresh">
            <Button variant="ghost" size="sm" iconOnly aria-label="Refresh">
              <RefreshCw />
            </Button>
          </Tooltip>
          <Tooltip label={args.label} side={args.side}>
            <Button variant="ghost" size="sm" iconOnly aria-label={args.label}>
              <Download />
            </Button>
          </Tooltip>
        </PanelActions>
        <DataTable caption="Source hosts and their state" indexed={false}>
          <TableHead>
            <TableColumn width="fill">Host</TableColumn>
            <TableColumn align="end">State</TableColumn>
          </TableHead>
          <TableBody>
            {sources.map(([host, state]) => (
              <TableRow key={host}>
                <TableCell mono>{host}</TableCell>
                <TableCell align="end">
                  <StatusPill tone={state === "running" ? "ok" : "warn"}>{state}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </Panel>
    </Page>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { name: "Sources" }).getBoundingClientRect();
    const [refresh, exportButton] = [
      canvas.getByRole("button", { name: "Refresh" }),
      canvas.getByRole("button", { name: args.label }),
    ];
    const a = refresh.getBoundingClientRect();
    const b = exportButton.getBoundingClientRect();
    await expect([a.width, a.height]).toEqual([b.width, b.height]);
    await expect(refresh.className).toBe(exportButton.className);
    const middle = (r: DOMRect) => r.top + r.height / 2;
    await expect(Math.abs(middle(a) - middle(title))).toBeLessThanOrEqual(2);
    await expect(Math.abs(middle(b) - middle(title))).toBeLessThanOrEqual(2);
    const tip = await expectPlaced(exportButton, args.label, [refresh]);
    if (window.innerWidth > 600) await expect(tip.dataset.align).toBe("center");
    await expect(exportButton).not.toHaveFocus();
  },
};

/**
 * At the window edge: the same panel at the top of a narrow column, its
 * last action in the corner, with a long German name. A centred bubble
 * would cross the window edge, so it lines up with the button end and the
 * arrow still points at the button. Where there is no room above (compact,
 * phone), it opens below.
 */
export const AtTheWindowEdge: Story = {
  args: { label: "Als CSV-Datei exportieren" },
  render: (args) => (
    <Panel title="Quellen" heading={2} padded={false}>
      <PanelMeta>12 Quellen</PanelMeta>
      <PanelActions>
        <Tooltip label="Neu laden">
          <Button variant="ghost" size="sm" iconOnly aria-label="Neu laden">
            <RefreshCw />
          </Button>
        </Tooltip>
        <Tooltip label={args.label} side={args.side}>
          <Button variant="ghost" size="sm" iconOnly aria-label={args.label}>
            <Download />
          </Button>
        </Tooltip>
      </PanelActions>
      <DataTable caption="Quellen und ihr Zustand" indexed={false}>
        <TableHead>
          <TableColumn width="fill">Host</TableColumn>
          <TableColumn align="end">Zustand</TableColumn>
        </TableHead>
        <TableBody>
          {sources.map(([host, state]) => (
            <TableRow key={host}>
              <TableCell mono>{host}</TableCell>
              <TableCell align="end">
                <StatusPill tone={state === "running" ? "ok" : "warn"}>
                  {state === "running" ? "läuft" : "pausiert"}
                </StatusPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </Panel>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const exportButton = canvas.getByRole("button", { name: args.label });
    const tip = await expectPlaced(exportButton, args.label, [canvas.getByRole("button", { name: "Neu laden" })]);
    await expect(tip.dataset.align).toBe("end");
  },
};

/** Escape closes it and leaves focus on the control. */
export const ClosesOnEscape: Story = {
  render: (args) => (
    <Tooltip label={args.label}>
      <Button variant="ghost" iconOnly aria-label={args.label}>
        <Download />
      </Button>
    </Tooltip>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.tab();
    await waitFor(() => expect(body.getByText(args.label, { selector: ".di-tooltip" })).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByText(args.label, { selector: ".di-tooltip" })).toBeNull());
    await expect(canvas.getByRole("button", { name: args.label })).toHaveFocus();
  },
};

/* Relative luminance and contrast of two computed rgb() colours (WCAG 2). */
const luminance = (rgb: string) => {
  const [r, g, b] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const rail = [
  { id: "overview", label: "Overview", icon: <Gauge />, badge: "", tone: "neutral" as const },
  { id: "cases", label: "Cases", icon: <ShieldAlert />, badge: "3", tone: "alert" as const },
  { id: "reports", label: "Reports", icon: <FileText />, badge: "12", tone: "neutral" as const },
  { id: "licence", label: "Licence", icon: <BadgeCheck />, badge: "new", tone: "seal" as const },
];

/**
 * With a count: the collapsed navigation rail, where an item shows only its
 * icon and a dot for what waits behind it. Hovered or focused, the tooltip
 * names the item and repeats the count, as a light pill on the bubble (the
 * alert one bright red) so it reads in both themes.
 */
export const WithACount: Story = {
  args: { label: "Cases", side: "right" },
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "desk", isRotated: false } },
  render: () => (
    <SidebarProvider defaultExpanded={false}>
      <Sidebar label="Sections" closeLabel="Close navigation">
        <SidebarContent>
          <SidebarMenu>
            {rail.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  label={item.label}
                  href={`#/${item.id}`}
                  active={item.id === "overview"}
                  badge={item.badge}
                  badgeTone={item.tone}
                >
                  {item.icon}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Page>
          <PageHeader>
            <PageHeaderTitle>Overview</PageHeaderTitle>
          </PageHeader>
        </Page>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(nav).toHaveAttribute("data-state", "collapsed");
    for (const item of rail.slice(1)) {
      const link = () => within(nav).getByRole("link", { name: new RegExp(item.label) });
      // The rail loads its tooltips on demand and swaps the item when they are there; find it and hover again.
      const tip = await waitFor(
        async () => {
          await userEvent.hover(link());
          const found = await waitFor(
            () => {
              const tip = canvasElement.ownerDocument.querySelector<HTMLElement>(".di-tooltip");
              if (!tip?.textContent?.startsWith(item.label)) throw new Error("no tooltip yet");
              return tip;
            },
            { timeout: 600 },
          );
          await expect(found).toBeVisible();
          return found;
        },
        { timeout: 10000 },
      );
      await waitFor(() => expect(tip.getAnimations().length).toBe(0));
      const badge = tip.querySelector(".di-badge")!;
      await expect(badge).toHaveTextContent(item.badge);
      const bubble = getComputedStyle(tip).backgroundColor;
      const pill = getComputedStyle(badge);
      await expect(contrast(pill.backgroundColor, bubble)).toBeGreaterThanOrEqual(3);
      await expect(contrast(pill.color, pill.backgroundColor)).toBeGreaterThanOrEqual(4.5);
      await userEvent.unhover(link());
    }
  },
};
