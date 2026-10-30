import { useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Archive, Bell, Building2, FileSearch, Gauge, RefreshCw, Settings, ShieldAlert, UserRound } from "lucide-react";
import { AppShellBar, AppShellBarEnd } from "../../shell/AppShellBar";
import { AppShellContent } from "../../shell/AppShellContent";
import { Button } from "../../actions/Button";
import { StatusPill } from "../../marks/status/StatusPill";
import { Breadcrumb } from "../Breadcrumb";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Menu, MenuGroup, MenuItem } from "../Menu";
import { Sidebar } from "./Sidebar";
import { SidebarBrand } from "./frame/SidebarBrand";
import { SidebarInset } from "./frame/SidebarInset";
import { SidebarMenu, SidebarMenuItem } from "./menu/SidebarMenu";
import { SidebarMenuButton } from "./menu/SidebarMenuButton";
import { SidebarProvider } from "./state/SidebarProvider";
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader } from "./menu/SidebarSections";
import { SidebarTrigger } from "./frame/SidebarTrigger";

type SampleProps = {
  label: string;
  closeLabel: string;
  defaultExpanded?: boolean;
  storageKey?: string;
  words?: Words;
};

/* What the shell says, in the two languages the bar has to hold on one row. */
const english = {
  workspace: "Example studio",
  monitor: "Monitor",
  records: "Records",
  toggle: "Toggle navigation",
  more: "More",
  demo: "Demo data off",
  refresh: "Refresh",
  sealed: "Admin sealed",
  lede: "Press Ctrl+B or Cmd+B to collapse the navigation to its icon rail.",
  names: {} as Record<string, string>,
};
type Words = typeof english;

const german: Words = {
  workspace: "Beispielstudio für Sicherheitsanalysen",
  monitor: "Überwachung",
  records: "Aufzeichnungen",
  toggle: "Navigation ein- oder ausblenden",
  more: "Weitere",
  demo: "Demodaten ausgeschaltet",
  refresh: "Aktualisieren",
  sealed: "Verwaltung versiegelt",
  lede: "Strg+B oder Cmd+B blendet die Navigation zur Symbolleiste ein.",
  names: {
    overview: "Übersicht",
    findings: "Erkenntnisse und Befunde",
    sources: "Datenquellen",
    alerts: "Benachrichtigungen",
    archive: "Archiv",
    settings: "Einstellungen",
  },
};

const sections = [
  { id: "overview", label: "Overview", icon: <Gauge /> },
  { id: "findings", label: "Findings", icon: <ShieldAlert />, badge: "12", badgeTone: "alert" as const },
  { id: "sources", label: "Sources", icon: <FileSearch /> },
];

const records = [
  { id: "alerts", label: "Alerts", icon: <Bell />, badge: "3" },
  { id: "archive", label: "Archive", icon: <Archive /> },
  { id: "settings", label: "Settings", icon: <Settings /> },
];

// Stands in for a client-side router's Link: it navigates without a page load.
function RouterLink({
  to,
  onNavigate,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; onNavigate: (to: string) => void }) {
  return (
    <a
      {...rest}
      href={`#/${to}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        rest.onClick?.(event);
        event.preventDefault();
        onNavigate(to);
      }}
    >
      {children}
    </a>
  );
}

function SampleSidebar({ label, closeLabel, defaultExpanded = true, storageKey, words = english }: SampleProps) {
  const [active, setActive] = useState("findings");
  const name = (item: { id: string; label: string }) => words.names[item.id] ?? item.label;
  const current = name([...sections, ...records].find((item) => item.id === active)!);

  return (
    <SidebarProvider defaultExpanded={defaultExpanded} storageKey={storageKey} skipLabel="Skip to content">
      <Sidebar label={label} closeLabel={closeLabel}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label={words.workspace} href="#/workspace">
                <Building2 />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{words.monitor}</SidebarGroupLabel>
            <SidebarMenu>
              {sections.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    label={name(item)}
                    badge={item.badge}
                    badgeTone={item.badgeTone}
                    active={item.id === active}
                    render={<RouterLink to={item.id} onNavigate={setActive} />}
                  >
                    {item.icon}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>{words.records}</SidebarGroupLabel>
            <SidebarMenu>
              {records.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    label={name(item)}
                    badge={item.badge}
                    active={item.id === active}
                    render={<RouterLink to={item.id} onNavigate={setActive} />}
                  >
                    {item.icon}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="Nora Feld">
                <UserRound />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarBrand />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppShellBar>
          <SidebarTrigger label={words.toggle} />
          <Breadcrumb
            label="Breadcrumb"
            items={[{ label: words.workspace, href: "#/workspace" }, { label: current }]}
          />
          <AppShellBarEnd moreLabel={words.more}>
            <StatusPill tone="neutral">{words.demo}</StatusPill>
            <StatusPill tone="recorded">{words.sealed}</StatusPill>
            <Button variant="ghost" size="sm">
              <RefreshCw aria-hidden />
              {words.refresh}
            </Button>
          </AppShellBarEnd>
        </AppShellBar>
        <AppShellContent>
          <PageHeader eyebrow="Record" lede={words.lede}>
            <PageHeaderTitle>{current}</PageHeaderTitle>
          </PageHeader>
        </AppShellContent>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "Navigation/Sidebar",
  tags: ["layer:pattern"],
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  args: { label: "Sections", closeLabel: "Close navigation", children: null },
  argTypes: {
    label: { control: "text" },
    closeLabel: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("link", { name: /Findings/ })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getAllByRole("main")).toHaveLength(1);
    await userEvent.tab();
    const skip = canvas.getByRole("link", { name: "Skip to content" });
    await expect(skip).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("main")).toHaveFocus();

    await expect(canvas.getByRole("img", { name: "datAInsights" })).toHaveClass("di-sb-brand-logo");
    await userEvent.click(canvas.getByRole("button", { name: "Toggle navigation" }));
    await expect(nav).toHaveAttribute("data-state", "collapsed");
    await expect(canvas.getByRole("img", { name: "datAInsights" })).toHaveClass("di-sb-brand-mark");
    await expect(canvas.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "false");

    await userEvent.keyboard("{Control>}b{/Control}");
    await expect(nav).toHaveAttribute("data-state", "expanded");
  },
};

export const Collapsed: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} defaultExpanded={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(nav).toHaveAttribute("data-state", "collapsed");
    const body = within(canvasElement.ownerDocument.body);
    // The rail loads its tooltips on demand; the item is hovered again once they are there. The first load is a
    // cold module the dev server transforms on request, which took over 3s while eight test projects ran at once.
    await waitFor(
      async () => {
        await userEvent.hover(within(nav).getByRole("link", { name: "Sources" }));
        await expect(await body.findByText("Sources", { selector: ".di-tooltip" }, { timeout: 600 })).toBeVisible();
      },
      { timeout: 10000 },
    );
  },
};

export const GroupsAndBadges: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("group", { name: "Records" })).toBeVisible();
    const alerts = within(nav).getByRole("link", { name: "Alerts 3" });
    await userEvent.click(alerts);
    await expect(alerts).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: "Findings 12" })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByRole("heading", { level: 1, name: "Alerts" })).toBeVisible();
  },
};

export const Remembered: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  beforeEach: () => {
    window.localStorage.setItem("di-sidebar-story", "collapsed");
    return () => window.localStorage.removeItem("di-sidebar-story");
  },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} storageKey="di-sidebar-story" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("navigation", { name: "Sections" })).toHaveAttribute("data-state", "collapsed");
    await userEvent.click(canvas.getByRole("button", { name: "Toggle navigation" }));
    await waitFor(() => expect(window.localStorage.getItem("di-sidebar-story")).toBe("expanded"));
  },
};

export const MobileDrawer: Story = {
  parameters: {
    viewport: { options: { phone: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" } } },
  },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expect(canvas.queryByRole("navigation", { name: "Sections" })).toBeNull();

    const trigger = canvas.getByRole("button", { name: "Toggle navigation" });
    await userEvent.click(trigger);
    // The drawer is a lazy chunk; on a busy test run its first load can outlast the default second.
    const drawer = await body.findByRole("dialog", { name: "Sections" }, { timeout: 5000 });
    await waitFor(() => expect(drawer).toBeVisible());
    await waitFor(() => expect(drawer.contains(canvasElement.ownerDocument.activeElement)).toBe(true));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    await body.findByRole("dialog", { name: "Sections" });
    await userEvent.click(canvasElement.ownerDocument.querySelector<HTMLElement>(".di-sb-backdrop")!);
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    const reopened = await body.findByRole("dialog", { name: "Sections" });
    await userEvent.tab({ shift: true });
    await waitFor(() => expect(reopened.contains(canvasElement.ownerDocument.activeElement)).toBe(true));
    await userEvent.click(within(reopened).getByRole("link", { name: "Sources" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};

/** The drawer open on a phone: it comes from the inline start over a scrim, with the page behind it. */
export const MobileDrawerOpen: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Toggle navigation" }));
    const drawer = await body.findByRole("dialog", { name: "Sections" }, { timeout: 5000 });
    await waitFor(() => expect(Math.round(drawer.getBoundingClientRect().left)).toBe(0));
  },
};

/*
 * The bar on a phone and a tablet: one row, the trigger, the page's name and
 * one overflow button, in both densities. Its height is measured, not looked at.
 */
async function barIsOneRow(canvasElement: HTMLElement, width: number) {
  const doc = canvasElement.ownerDocument;
  await expect(doc.defaultView!.innerWidth).toBe(width);
  const bar = canvasElement.querySelector<HTMLElement>(".di-topbar")!;
  const height = parseFloat(getComputedStyle(bar).getPropertyValue("--di-shell-bar-height"));
  const box = bar.getBoundingClientRect();
  await expect(box.height).toBe(height);
  for (const part of bar.querySelectorAll<HTMLElement>(".di-topbar-start > *, .di-top-actions > *")) {
    const own = part.getBoundingClientRect();
    await expect(own.top, part.className).toBeGreaterThanOrEqual(box.top);
    await expect(own.bottom, part.className).toBeLessThanOrEqual(box.bottom);
    await expect(own.right, part.className).toBeLessThanOrEqual(box.right);
  }
  await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
}

function phoneBar(width: number, words: Words, folds: boolean): Story {
  return {
    parameters: {
      viewport: { options: { bar: { name: "Bar", styles: { width: width + "px", height: "844px" }, type: "mobile" } } },
    },
    globals: { viewport: { value: "bar", isRotated: false } },
    render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} words={words} />,
    play: async ({ canvasElement }) => {
      await barIsOneRow(canvasElement, width);
      const canvas = within(canvasElement);
      const more = canvas.queryByRole("button", { name: words.more });
      await expect(more !== null).toBe(folds);
      if (!more) return;
      const body = within(canvasElement.ownerDocument.body);
      await userEvent.click(more);
      const panel = await body.findByRole("dialog", { name: words.more });
      await waitFor(() => expect(within(panel).getByRole("button", { name: words.refresh })).toBeVisible());
      await expect(within(panel).getByText(words.demo)).toBeVisible();
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(body.queryByRole("dialog", { name: words.more })).toBeNull());
      await waitFor(() => expect(more).toHaveFocus());
    },
  };
}

/** A phone: the status and the refresh fold into one overflow button; the bar stays one row. */
export const PhoneBar: Story = phoneBar(390, english, true);
/** The smallest phone, with the German words: the name truncates, the end folds. */
export const PhoneBarGerman: Story = phoneBar(360, german, true);
/** German on a phone at 390. */
export const PhoneBarGerman390: Story = phoneBar(390, german, true);
/** A tablet in portrait, under the drawer breakpoint: the English end fits beside the name. */
export const TabletBar: Story = phoneBar(768, english, false);
/** The same tablet in German: the longer words still fit beside a readable name, on one row. */
export const TabletBarGerman: Story = phoneBar(768, german, false);

/** A desk: the end stays inline on one row, in German too. */
export const DeskBarGerman: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} words={german} />,
  play: async ({ canvasElement }) => {
    await barIsOneRow(canvasElement, canvasElement.ownerDocument.defaultView!.innerWidth);
    await expect(within(canvasElement).queryByRole("button", { name: german.more })).toBeNull();
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
};

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("Northwind Security");
  return (
    <Menu
      open={open}
      onOpenChange={setOpen}
      label="Switch workspace"
      align="start"
      trigger={(props) => (
        <SidebarMenuButton label={current} menu {...props}>
          <Building2 />
        </SidebarMenuButton>
      )}
    >
      <MenuGroup label="Workspaces">
        {["Northwind Security", "Harbor Labs"].map((name) => (
          <MenuItem
            key={name}
            checked={name === current}
            onSelect={() => {
              setCurrent(name);
              setOpen(false);
            }}
          >
            {name}
          </MenuItem>
        ))}
      </MenuGroup>
    </Menu>
  );
}

/** The header item opens a menu to switch context; the chevron says so. */
export const ContextSwitcher: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => (
    <SidebarProvider>
      <Sidebar label={args.label} closeLabel={args.closeLabel}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <WorkspaceSwitcher />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>{null}</SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Northwind Security" }));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(body.getByRole("menuitemradio", { name: "Harbor Labs" }));
    await expect(canvas.getByRole("button", { name: "Harbor Labs" })).toBeVisible();
  },
};

/** `SidebarFooter` is pinned to the end even when it is written first. */
export const FooterWrittenFirst: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  render: (args) => (
    <SidebarProvider>
      <Sidebar label={args.label} closeLabel={args.closeLabel}>
        <SidebarFooter>
          <span>Nora Feld</span>
        </SidebarFooter>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton label="Overview" href="#/overview">
                  <Gauge />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppShellBar>
          <SidebarTrigger label="Toggle navigation" />
          <Breadcrumb label="Breadcrumb" items={[{ label: "Overview" }]} />
        </AppShellBar>
        <AppShellContent>
          <h1>Overview</h1>
        </AppShellContent>
      </SidebarInset>
    </SidebarProvider>
  ),
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector(".di-sb-footer")!;
    const content = canvasElement.querySelector(".di-sb-content")!;
    await expect(footer.getBoundingClientRect().top).toBeGreaterThan(content.getBoundingClientRect().top);
    await expect(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  },
};
