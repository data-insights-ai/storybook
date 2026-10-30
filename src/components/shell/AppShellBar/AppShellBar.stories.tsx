import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Boxes, Building2, Gauge, RefreshCw, Settings, ShieldAlert } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { StatusPill } from "../../status/StatusPill";
import { Breadcrumb } from "../../navigation/Breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../navigation/Sidebar";
import { AppShellContent } from "../AppShellContent";
import { AppShellBar, AppShellBarEnd, AppShellBarKeep } from "./AppShellBar";

/* What the bar says, in the two languages it has to hold on one row. */
const english = {
  workspace: "Production",
  page: "Sources",
  sections: "Sections",
  close: "Close navigation",
  toggle: "Toggle navigation",
  more: "More",
  demo: "Demo data off",
  sealed: "Admin sealed",
  refresh: "Refresh",
  notifications: "Notifications",
  unread: "3 unread",
  lede: "Every host the workspace reads from.",
  nav: { overview: "Overview", findings: "Findings", sources: "Sources", settings: "Settings" },
};
type Words = typeof english;

const german: Words = {
  workspace: "Produktion",
  page: "Datenquellen",
  sections: "Bereiche",
  close: "Navigation schließen",
  toggle: "Navigation ein- oder ausblenden",
  more: "Weitere",
  demo: "Demodaten ausgeschaltet",
  sealed: "Verwaltung versiegelt",
  refresh: "Aktualisieren",
  notifications: "Benachrichtigungen",
  unread: "3 ungelesen",
  lede: "Jeder Host, von dem der Arbeitsbereich liest.",
  nav: { overview: "Übersicht", findings: "Befunde", sources: "Datenquellen", settings: "Einstellungen" },
};

const icons = { overview: <Gauge />, findings: <ShieldAlert />, sources: <Boxes />, settings: <Settings /> };

/* The frame a product composes: the sidebar, the bar, the page. */
function Frame({ words = english, keepOnly = false }: { words?: Words; keepOnly?: boolean }) {
  return (
    <SidebarProvider skipLabel="Skip to content">
      <Sidebar label={words.sections} closeLabel={words.close}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="Example Security GmbH" href="#/organization">
                <Building2 />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{words.workspace}</SidebarGroupLabel>
            <SidebarMenu>
              {(Object.keys(icons) as (keyof typeof icons)[]).map((id) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton label={words.nav[id]} href={`#/${id}`} active={id === "sources"}>
                    {icons[id]}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppShellBar>
          <SidebarTrigger label={words.toggle} />
          <Breadcrumb
            label="Breadcrumb"
            items={[{ label: words.workspace, href: "#/overview" }, { label: words.page }]}
          />
          <AppShellBarEnd moreLabel={words.more}>
            {keepOnly ? null : (
              <>
                <StatusPill tone="neutral">{words.demo}</StatusPill>
                <StatusPill tone="recorded">{words.sealed}</StatusPill>
                <Button variant="ghost" size="sm">
                  <RefreshCw aria-hidden />
                  {words.refresh}
                </Button>
              </>
            )}
            <AppShellBarKeep>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label={words.notifications}
                badge={3}
                badgeLabel={words.unread}
              >
                <Bell aria-hidden />
              </Button>
            </AppShellBarKeep>
          </AppShellBarEnd>
        </AppShellBar>
        <AppShellContent>
          <PageHeader lede={words.lede}>
            <PageHeaderTitle>{words.page}</PageHeaderTitle>
          </PageHeader>
        </AppShellContent>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "Shell/AppShellBar",
  tags: ["layer:block"],
  component: AppShellBar,
  parameters: { layout: "fullscreen", controls: { disable: true } },
  args: { children: null },
} satisfies Meta<typeof AppShellBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * One row, measured: the bar is exactly `--di-shell-bar-height` tall, every
 * part sits inside it, nothing scrolls sideways, and the bell keeps its count.
 */
async function oneRow(canvasElement: HTMLElement, words: Words) {
  const doc = canvasElement.ownerDocument;
  const bar = canvasElement.querySelector<HTMLElement>(".di-topbar")!;
  const box = bar.getBoundingClientRect();
  await expect(box.height).toBe(parseFloat(getComputedStyle(bar).getPropertyValue("--di-shell-bar-height")));
  for (const part of bar.querySelectorAll<HTMLElement>(".di-topbar-start > *, .di-top-actions > *")) {
    const own = part.getBoundingClientRect();
    await expect(own.top, part.className).toBeGreaterThanOrEqual(box.top);
    await expect(own.bottom, part.className).toBeLessThanOrEqual(box.bottom);
    await expect(own.right, part.className).toBeLessThanOrEqual(box.right);
  }
  await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  const bell = within(bar).getByRole("button", { name: `${words.notifications}, ${words.unread}` });
  await expect(bell).toBeVisible();
  await expect(bell).toHaveTextContent("3");
}

function at(width: number, words: Words, folds: boolean): Story {
  return {
    parameters: {
      viewport: { options: { bar: { name: "Bar", styles: { width: `${width}px`, height: "844px" }, type: "mobile" } } },
    },
    globals: { viewport: { value: "bar", isRotated: false } },
    render: () => <Frame words={words} />,
    play: async ({ canvasElement }) => {
      await expect(canvasElement.ownerDocument.defaultView!.innerWidth).toBe(width);
      await oneRow(canvasElement, words);
      const canvas = within(canvasElement);
      const more = canvas.queryByRole("button", { name: words.more });
      await expect(more !== null).toBe(folds);
      if (!more) return;
      const bell = canvas.getByRole("button", { name: `${words.notifications}, ${words.unread}` });
      await expect(bell.getBoundingClientRect().left).toBeGreaterThan(more.getBoundingClientRect().right);
      const body = within(canvasElement.ownerDocument.body);
      await userEvent.click(more);
      const panel = await body.findByRole("dialog", { name: words.more });
      await waitFor(() => expect(within(panel).getByRole("button", { name: words.refresh })).toBeVisible());
      await expect(within(panel).getByText(words.demo)).toBeVisible();
      await expect(within(panel).queryByRole("button", { name: new RegExp(words.notifications) })).toBeNull();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(body.queryByRole("dialog", { name: words.more })).toBeNull());
      await waitFor(() => expect(more).toHaveFocus());
    },
  };
}

/**
 * The bar a product renders over every page: the trigger, where the reader
 * is, then the app-wide status and the bell. On a desk everything sits on
 * one row; the bell is last, at the bar's end.
 */
export const Product: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: () => <Frame />,
  play: async ({ canvasElement }) => {
    await oneRow(canvasElement, english);
    await expect(within(canvasElement).queryByRole("button", { name: english.more })).toBeNull();
  },
};

/** The same bar in German on a desk: the longer words still sit on one row. */
export const ProductGerman: Story = {
  name: "Product (German)",
  globals: { viewport: { value: "desk", isRotated: false } },
  render: () => <Frame words={german} />,
  play: async ({ canvasElement }) => {
    await oneRow(canvasElement, german);
    await expect(within(canvasElement).queryByRole("button", { name: german.more })).toBeNull();
  },
};

/**
 * A phone: the status and the refresh fold into "More"; the bell stays
 * beside it with its count, because a count in an overflow is a count
 * nobody sees. The name truncates before anything wraps.
 */
export const Phone: Story = at(390, english, true);

/** The smallest phone in German: one row, the bell still visible. */
export const PhoneGerman: Story = { name: "Phone (German, 360)", ...at(360, german, true) };

/** A tablet under the drawer breakpoint: the English end fits beside the name. */
export const Tablet: Story = at(768, english, false);

/** The same tablet in German: still one row, nothing folded. */
export const TabletGerman: Story = { name: "Tablet (German)", ...at(768, german, false) };

/**
 * Only what stays: a bar whose end is the bell alone never shows an
 * overflow button, at any width.
 */
export const KeepOnly: Story = {
  name: "Keep only",
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => <Frame keepOnly />,
  play: async ({ canvasElement }) => {
    await oneRow(canvasElement, english);
    await expect(within(canvasElement).queryByRole("button", { name: english.more })).toBeNull();
  },
};

/** WCAG reflow at 320px: one row, the name truncated, nothing scrolling sideways. */
export const Reflow320: Story = {
  name: "Reflow (320)",
  ...at(320, english, true),
};
