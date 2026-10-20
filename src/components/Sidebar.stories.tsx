import { useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Archive, Bell, Building2, FileSearch, Gauge, Settings, ShieldAlert, UserRound } from "lucide-react";
import { AppShellBar } from "./AppShell";
import { Breadcrumb } from "./Breadcrumb";
import { PageHeader, PageHeaderTitle } from "./Heading";
import { Menu, MenuGroup, MenuItem } from "./Menu";
import { Sidebar } from "./Sidebar";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarInset } from "./SidebarInset";
import { SidebarMenu, SidebarMenuItem } from "./SidebarMenu";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { SidebarProvider } from "./SidebarProvider";
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader } from "./SidebarSections";
import { SidebarTrigger } from "./SidebarTrigger";

type SampleProps = {
  label: string;
  closeLabel: string;
  defaultExpanded?: boolean;
  storageKey?: string;
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
function RouterLink({ to, onNavigate, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; onNavigate: (to: string) => void }) {
  return (
    <a
      {...rest}
      href={`#/${to}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        rest.onClick?.(event);
        event.preventDefault();
        onNavigate(to);
      }}
    />
  );
}

function SampleSidebar({ label, closeLabel, defaultExpanded = true, storageKey }: SampleProps) {
  const [active, setActive] = useState("findings");
  const current = [...sections, ...records].find((item) => item.id === active)!;

  return (
    <SidebarProvider defaultExpanded={defaultExpanded} storageKey={storageKey}>
      <Sidebar label={label} closeLabel={closeLabel}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="Example studio" href="#/workspace">
                <Building2 />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Monitor</SidebarGroupLabel>
            <SidebarMenu>
              {sections.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    label={item.label}
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
            <SidebarGroupLabel>Records</SidebarGroupLabel>
            <SidebarMenu>
              {records.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    label={item.label}
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
          <SidebarTrigger label="Toggle navigation" />
          <Breadcrumb label="Breadcrumb" items={[{ label: "Example studio", href: "#/workspace" }, { label: current.label }]} />
        </AppShellBar>
        <div style={{ padding: "var(--di-space-24)" }}>
          <PageHeader eyebrow="Record" lede="Press Ctrl+B or Cmd+B to collapse the navigation to its icon rail.">
            <PageHeaderTitle>{current.label}</PageHeaderTitle>
          </PageHeader>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const meta = {
  title: "Patterns/Sidebar",
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
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(within(nav).getByRole("link", { name: /Findings/ })).toHaveAttribute("aria-current", "page");

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
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} defaultExpanded={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(nav).toHaveAttribute("data-state", "collapsed");
    const sources = within(nav).getByRole("link", { name: "Sources" });
    await userEvent.hover(sources);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText("Sources", { selector: ".di-tooltip" })).toBeVisible());
  },
};

export const GroupsAndBadges: Story = {
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
  parameters: { viewport: { options: { phone: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" } } } },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: (args) => <SampleSidebar label={args.label} closeLabel={args.closeLabel} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expect(canvas.queryByRole("navigation", { name: "Sections" })).toBeNull();

    const trigger = canvas.getByRole("button", { name: "Toggle navigation" });
    await userEvent.click(trigger);
    const drawer = await body.findByRole("dialog", { name: "Sections" });
    await waitFor(() => expect(drawer).toBeVisible());
    await waitFor(() => expect(drawer.contains(canvasElement.ownerDocument.activeElement)).toBe(true));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());

    await userEvent.click(trigger);
    const reopened = await body.findByRole("dialog", { name: "Sections" });
    await userEvent.click(within(reopened).getByRole("link", { name: "Sources" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
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
          <MenuItem key={name} checked={name === current} onSelect={() => { setCurrent(name); setOpen(false); }}>
            {name}
          </MenuItem>
        ))}
      </MenuGroup>
    </Menu>
  );
}

/** The header item opens a menu to switch context; the chevron says so. */
export const ContextSwitcher: Story = {
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
