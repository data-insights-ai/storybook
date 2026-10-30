import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { sampleChrome } from "../../../../.storybook/console/chrome.sample";
import { Button } from "../../actions/Button";
import { Menu, MenuGroup, MenuItem } from "../../navigation/Menu";
import { useState } from "react";
import { Breadcrumb } from "../../navigation/Breadcrumb";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Select } from "../../forms/select/Select";
import { StatusPill } from "../../marks/status/StatusPill";
import { AppShell, AppShellContent, AppShellMain } from "./AppShell";
import { AppShellBar, AppShellBarEnd } from "./AppShellBar";
import { AppShellContext, AppShellFoot, AppShellRail, type NavGroup } from "./AppShellRail";
import { Console } from "../../../../.storybook/console/Console";

/* The sample sections, as a product hands them over: every item a link. */
const linkedGroups: NavGroup[] = sampleChrome.groups.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, href: `#/${item.id}` })),
}));

const meta = {
  title: "Shell/AppShell",
  tags: ["layer:pattern"],
  component: AppShell,
  parameters: { layout: "fullscreen" },
  args: { skipLabel: "Skip to content", children: null },
  argTypes: {
    skipLabel: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shell a product renders: full-bleed, every part a slot. The rail's
 * items are links; the bar holds whatever the product puts there — here a
 * breadcrumb and a status. The rail and the bar stay while the page scrolls.
 */
export const Product: Story = {
  render: (args) => (
    <AppShell {...args}>
      <AppShellRail
        workspace={sampleChrome.workspace}
        workspaceId={sampleChrome.workspaceId}
        navLabel={sampleChrome.navLabel}
        groups={linkedGroups}
        active="findings"
        sealedMark={sampleChrome.sealedMark}
      >
        <AppShellFoot>
          <span>{sampleChrome.runtime}</span>
          <span>{sampleChrome.version}</span>
        </AppShellFoot>
      </AppShellRail>
      <AppShellMain>
        <AppShellBar>
          <Breadcrumb label="Breadcrumb" items={[{ label: "WS-01", href: "#/overview" }, { label: "findings" }]} />
          <AppShellBarEnd moreLabel="More">
            <StatusPill tone="warn">sample data</StatusPill>
          </AppShellBarEnd>
        </AppShellBar>
        <AppShellContent>
          <PageHeader eyebrow="Record" lede="Everything the monitor has raised and not yet closed.">
            <PageHeaderTitle>Findings</PageHeaderTitle>
          </PageHeader>
          <p>The rail, the workspace and the runtime stay on every page. The content here is what changes.</p>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    const current = within(nav).getByRole("link", { name: /Findings/ });
    await expect(current).toHaveAttribute("href", "#/findings");
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: /Watchlist/ })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByRole("main")).toHaveAttribute("id", "di-content");
  },
};

/**
 * `width="contained"`: the page stops widening at 1440px. The default,
 * `full`, follows the window; `Page` keeps records and forms at their
 * measure and `Grid` adds columns on large screens.
 */
export const Contained: Story = {
  render: (args) => (
    <AppShell {...args}>
      <AppShellRail
        workspace={sampleChrome.workspace}
        workspaceId={sampleChrome.workspaceId}
        navLabel={sampleChrome.navLabel}
        groups={linkedGroups}
        active="findings"
        sealedMark={sampleChrome.sealedMark}
      />
      <AppShellMain>
        <AppShellBar>
          <Breadcrumb label="Breadcrumb" items={[{ label: "WS-01", href: "#/overview" }, { label: "findings" }]} />
        </AppShellBar>
        <AppShellContent width="contained">
          <PageHeader eyebrow="Record" lede="The page stops at 1440px.">
            <PageHeaderTitle>Findings</PageHeaderTitle>
          </PageHeader>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const main = within(canvasElement).getByRole("main");
    await expect(getComputedStyle(main).maxWidth).toBe("1440px");
  },
};

/** Persistent context stays before navigation in both layout and keyboard order. */
export const WithContext: Story = {
  render: (args) => (
    <AppShell {...args}>
      <AppShellRail
        workspace="Register"
        workspaceId=""
        navLabel="Sections"
        groups={linkedGroups}
        active="findings"
        sealedMark={sampleChrome.sealedMark}
      >
        <AppShellFoot>
          <span>Local runtime</span>
        </AppShellFoot>
        <AppShellContext>
          <Select id="context-organization" label="Organization" labelTrack="prose" mono={false} defaultValue="studio">
            <option value="studio">Example studio</option>
            <option value="lab">Example lab</option>
          </Select>
          <Select id="context-workspace" label="Workspace" labelTrack="prose" mono={false} defaultValue="operations">
            <option value="operations">Operations</option>
            <option value="research">Research</option>
          </Select>
        </AppShellContext>
      </AppShellRail>
      <AppShellMain>
        <AppShellContent>
          <h1>Workspace overview</h1>
          <p>Context remains visible as the page changes.</p>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const organization = canvas.getByRole("combobox", { name: "Organization" });
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    await expect(Boolean(organization.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    await expect(organization.getBoundingClientRect().top).toBeLessThan(nav.getBoundingClientRect().top);
    await expect(canvas.getByRole("combobox", { name: "Workspace" })).toHaveValue("operations");
  },
};

// Measure the composited background, including transparent ghost controls.
function textContrast(element: HTMLElement) {
  const rgba = (value: string) => value.match(/[\d.]+/g)!.map(Number);
  function ground(node: HTMLElement | null): number[] {
    if (!node) return [255, 255, 255];
    const color = rgba(getComputedStyle(node).backgroundColor);
    const alpha = color[3] ?? 1;
    if (alpha === 1) return color.slice(0, 3);
    const behind = ground(node.parentElement);
    return color.slice(0, 3).map((channel, index) => channel * alpha + behind[index] * (1 - alpha));
  }
  const luminance = (channels: number[]) =>
    channels
      .slice(0, 3)
      .map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  const ink = luminance(rgba(getComputedStyle(element).color));
  const paper = luminance(ground(element));
  return (Math.max(ink, paper) + 0.05) / (Math.min(ink, paper) + 0.05);
}

const buttonVariants = ["primary", "secondary", "ghost", "danger", "seal", "inferred"] as const;

function ContextControls({ theme }: { theme: "light" | "dark" }) {
  return (
    <div data-theme={theme}>
      <AppShell skipLabel="Skip to content">
        <AppShellRail workspace="Register" workspaceId="" navLabel="Sections" groups={[]} active="">
          <AppShellContext>
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant} action
              </Button>
            ))}
            <Button disabled={true}>Unavailable action</Button>
          </AppShellContext>
        </AppShellRail>
        <AppShellMain>
          <AppShellContent>
            <h1>Context controls</h1>
            <p>Sidebar controls retain readable surfaces in either page theme.</p>
          </AppShellContent>
        </AppShellMain>
      </AppShell>
    </div>
  );
}

const contextContrastPlay: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  for (const variant of buttonVariants) {
    const button = canvas.getByRole("button", { name: variant + " action" });
    await expect(textContrast(button)).toBeGreaterThanOrEqual(4.5);
    await userEvent.hover(button);
    // Wait for actual CSS hover transitions, rather than checking their first frame.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await waitFor(() =>
      expect(button.getAnimations().some((animation) => animation.playState === "running")).toBe(false),
    );
    await expect(textContrast(button)).toBeGreaterThanOrEqual(4.5);
    await userEvent.unhover(button);
  }
  await expect(canvas.getByRole("button", { name: "Unavailable action" })).toBeDisabled();
};

/** All supported variants share the dark rail's local token boundary. */
export const ContextButtons: Story = {
  render: () => <ContextControls theme="light" />,
  play: contextContrastPlay,
};

export const ContextButtonsNight: Story = {
  render: () => <ContextControls theme="dark" />,
  play: contextContrastPlay,
};

/** Long choice labels remain readable within the rail rather than overflowing it. */
export const ContextLongChoices: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    const [workspace, setWorkspace] = useState("operations");
    return (
      <AppShell {...args}>
        <AppShellRail workspace="Register" workspaceId="" navLabel="Sections" groups={[]} active="">
          <AppShellContext>
            <Menu
              open={open}
              onOpenChange={setOpen}
              align="start"
              label="Choose workspace"
              trigger={(props) => (
                <Button {...props} variant="secondary">
                  Workspace
                </Button>
              )}
            >
              <MenuGroup label="Example studio with a deliberately long organization name">
                <MenuItem checked={workspace === "operations"} onSelect={() => setWorkspace("operations")}>
                  International operations and monitoring workspace
                </MenuItem>
                <MenuItem checked={workspace === "research"} onSelect={() => setWorkspace("research")}>
                  ResearchWorkspaceWithAnUnbrokenNameThatMustStillFitItsContainer
                </MenuItem>
              </MenuGroup>
            </Menu>
          </AppShellContext>
        </AppShellRail>
        <AppShellMain>
          <AppShellContent>
            <h1>Workspace context</h1>
          </AppShellContent>
        </AppShellMain>
      </AppShell>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole("menu", { name: "Choose workspace" });
    await expect(menu.scrollWidth).toBeLessThanOrEqual(menu.clientWidth);
    for (const item of canvas.getAllByRole("menuitemradio")) {
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
      await expect(item.getBoundingClientRect().height).toBeGreaterThan(32);
      await expect(textContrast(item)).toBeGreaterThanOrEqual(4.5);
    }
    await expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(
      canvas.getByRole("complementary").getBoundingClientRect().right,
    );
  },
};

const reflowName = "Workspace".repeat(17);

function LongNameShell({ theme }: { theme: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-theme={theme}>
      <AppShell skipLabel="Skip to content">
        <AppShellRail
          workspace={reflowName}
          workspaceId="REG-01"
          navLabel="Sections"
          groups={[{ label: "Workspaces", items: [{ id: "current", label: reflowName, href: "#workspace" }] }]}
          active="current"
        >
          <AppShellContext>
            <Menu
              open={open}
              onOpenChange={setOpen}
              label="Choose workspace"
              align="start"
              trigger={(props) => (
                <Button {...props} variant="secondary">
                  {reflowName}
                </Button>
              )}
            >
              <MenuGroup label="Example studio">
                <MenuItem checked={true} onSelect={() => setOpen(false)}>
                  {reflowName}
                </MenuItem>
              </MenuGroup>
            </Menu>
          </AppShellContext>
        </AppShellRail>
        <AppShellMain>
          <AppShellBar>
            <Breadcrumb
              label="Breadcrumb"
              items={[
                { label: "Example studio", href: "#organization" },
                { label: reflowName, href: "#workspace" },
                { label: reflowName + " settings" },
              ]}
            />
            <AppShellBarEnd moreLabel="More">
              <Button variant="secondary">{"Manage " + reflowName}</Button>
              <Button variant="ghost">Sign out</Button>
            </AppShellBarEnd>
          </AppShellBar>
          <AppShellContent>
            <PageHeader eyebrow="Workspace" lede="Long names remain readable without hiding ancestors or page actions.">
              <PageHeaderTitle>{reflowName}</PageHeaderTitle>
            </PageHeader>
          </AppShellContent>
        </AppShellMain>
      </AppShell>
    </div>
  );
}

function narrowReflow(theme: "light" | "dark", width: number): Story {
  return {
    parameters: {
      viewport: {
        options: { reflow: { name: "Reflow", styles: { width: width + "px", height: "844px" }, type: "mobile" } },
      },
    },
    globals: { viewport: { value: "reflow", isRotated: false } },
    render: () => <LongNameShell theme={theme} />,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const doc = canvasElement.ownerDocument;
      await expect(doc.defaultView!.innerWidth).toBe(width);
      await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
      const elements = canvasElement.querySelectorAll<HTMLElement>(
        ".di-shell, .di-sidebar, .di-brand-row, .di-nav-text, .di-sidebar-context, .di-menu-anchor, .di-topbar, .di-top-actions, .di-breadcrumb, .di-page-title, .di-btn",
      );
      for (const element of elements) {
        // The bar is one row: the name in it truncates with an ellipsis instead of wrapping.
        if (!element.closest(".di-topbar")) {
          await expect(element.scrollWidth, element.className + " content fits").toBeLessThanOrEqual(
            element.clientWidth + 1,
          );
        }
        await expect(element.getBoundingClientRect().right, element.className + " right edge").toBeLessThanOrEqual(
          width + 1,
        );
        await expect(element.getBoundingClientRect().left, element.className + " left edge").toBeGreaterThanOrEqual(-1);
      }
      const instance = canvasElement.querySelector<HTMLElement>(".di-instance")!;
      await expect(instance.clientHeight).toBeLessThanOrEqual(
        Math.ceil(parseFloat(getComputedStyle(instance).lineHeight)) + 1,
      );
      const bar = canvasElement.querySelector<HTMLElement>(".di-topbar")!;
      await expect(bar.getBoundingClientRect().height).toBe(
        parseFloat(getComputedStyle(bar).getPropertyValue("--di-shell-bar-height")),
      );
      const breadcrumb = within(canvas.getByRole("navigation", { name: "Breadcrumb" }));
      const ancestor = breadcrumb.queryByRole("link", { name: reflowName });
      if (ancestor) {
        await expect(ancestor).toHaveAttribute("href", "#workspace");
        ancestor.focus();
        await expect(ancestor).toHaveFocus();
        await expect(textContrast(ancestor)).toBeGreaterThanOrEqual(4.5);
      }
      await expect(breadcrumb.getByText(reflowName + " settings")).toHaveAttribute("aria-current", "page");
    },
  };
}

/** WCAG reflow at 320px, a phone at 390px, and a tablet at 768px. */
export const ReflowSmall: Story = narrowReflow("light", 320);
export const ReflowPhone: Story = narrowReflow("light", 390);
export const ReflowTablet: Story = narrowReflow("light", 768);
export const ReflowSmallNight: Story = narrowReflow("dark", 320);
export const ReflowPhoneNight: Story = narrowReflow("dark", 390);
export const ReflowTabletNight: Story = narrowReflow("dark", 768);

/** The Storybook window every screen sits in obeys the same reflow bounds. */
export const ReflowConsole: Story = {
  parameters: {
    viewport: { options: { reflow: { name: "Reflow", styles: { width: "390px", height: "844px" }, type: "mobile" } } },
  },
  globals: { viewport: { value: "reflow", isRotated: false } },
  render: () => (
    <Console
      title={reflowName}
      crumb={["Example studio " + reflowName, reflowName]}
      active="overview"
      chrome={{ ...sampleChrome, workspace: reflowName, operator: { ...sampleChrome.operator, name: reflowName } }}
    >
      <h1>Workspace overview</h1>
    </Console>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    await expect(doc.defaultView!.innerWidth).toBe(390);
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
    await expect(canvasElement.querySelector(".sb-window-title > svg")!.getBoundingClientRect().width).toBe(14);
    const bar = canvasElement.querySelector<HTMLElement>(".di-topbar")!;
    await expect(bar.getBoundingClientRect().height).toBe(
      parseFloat(getComputedStyle(bar).getPropertyValue("--di-shell-bar-height")),
    );
    for (const element of canvasElement.querySelectorAll<HTMLElement>(
      ".sb-canvas, .sb-window-title, .sb-window, .sb-operator-name",
    )) {
      await expect(element.scrollWidth, element.className).toBeLessThanOrEqual(element.clientWidth + 1);
    }
  },
};

function MobileNavigationExample() {
  const [label, setLabel] = useState("Example studio");
  const [context, setContext] = useState("north");
  return (
    <AppShell skipLabel="Skip to content">
      <AppShellRail
        workspace={label}
        workspaceId="REG-01"
        navLabel="Sections"
        groups={linkedGroups}
        active="findings"
        mobileNavigation={{ openLabel: "Open navigation", closeLabel: "Close navigation", contextKey: context }}
        sealedMark={sampleChrome.sealedMark}
      >
        <AppShellContext>
          <Select
            id="navigation-context"
            label="Register"
            value={context}
            onChange={(event) => setContext(event.target.value)}
          >
            <option value="north">Northern register</option>
            <option value="south">Southern register</option>
          </Select>
          <Button variant="ghost" onClick={() => setLabel("Renamed example studio")}>
            Refresh display label
          </Button>
          <Select id="navigation-draft" label="Local display choice" defaultValue="compact">
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </Select>
        </AppShellContext>
        <AppShellFoot>
          <span>Local preview</span>
          <span>v1</span>
        </AppShellFoot>
      </AppShellRail>
      <AppShellMain>
        <AppShellBar>
          <Breadcrumb
            label="Breadcrumb"
            items={[{ label: "Example studio", href: "#studio" }, { label: "Register" }]}
          />
        </AppShellBar>
        <AppShellContent>
          <h1>Register overview</h1>
          <p>The content stays near the top on a small screen. Navigation opens when requested.</p>
          <Button variant="secondary">Page action</Button>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  );
}

/** A labelled mobile opt-in leaves the existing desktop rail unchanged. */
export const MobileNavigation: Story = {
  parameters: {
    viewport: { options: { phone: { name: "Phone", styles: { width: "390px", height: "844px" }, type: "mobile" } } },
  },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => <MobileNavigationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      doc = canvasElement.ownerDocument;
    await expect(doc.defaultView!.innerWidth).toBe(390);
    await expect(canvas.getByRole("heading", { name: "Register overview" }).getBoundingClientRect().top).toBeLessThan(
      240,
    );
    const trigger = canvas.getByRole("button", { name: "Open navigation" });
    await userEvent.click(trigger);
    const dialog = canvas.getByRole("dialog", { name: "Sections" });
    await waitFor(() => expect(dialog).toBeVisible());
    await expect(dialog.contains(doc.activeElement)).toBe(true);
    await userEvent.selectOptions(
      within(dialog).getByRole("combobox", { name: "Local display choice" }),
      "comfortable",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Refresh display label" }));
    await waitFor(() => expect(dialog).toBeVisible());
    await userEvent.click(within(dialog).getByRole("button", { name: "Close navigation" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await expect(within(dialog).getByRole("combobox", { name: "Local display choice" })).toHaveValue("comfortable");
    await userEvent.selectOptions(within(dialog).getByRole("combobox", { name: /^Register$/ }), "south");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await userEvent.click(trigger);
    // Exercise native cancel handling here; trusted Escape is checked with an
    // actual browser keyboard during viewport/focus qualification.
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    const link = within(dialog).getByRole("link", { name: /Findings/ });
    // The runner sets a parent navigation target. Keep this fixture in place
    // while exercising the rail's link-selection close behavior.
    link.addEventListener("click", (event) => event.preventDefault(), { once: true });
    await userEvent.click(link);
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  },
};

export const MobileNavigationNight: Story = {
  ...MobileNavigation,
  globals: { ...MobileNavigation.globals, theme: "dark" },
};
/** Change the actual viewport to inspect the same composition at either size.
 *
 * Opt in with `mobileNavigation={{ openLabel: "Open navigation", closeLabel:
 * "Close navigation", contextKey: selectedContextId }}` on AppShellRail.
 * Labels are supplied by the caller. contextKey identifies the actual selected
 * context, not a refreshed label, proof or lease. Changing it closes the menu;
 * routine rerenders do not. Context/footer controls remain mounted on open/close.
 * The containing element changes at the desktop breakpoint, so keep application
 * selections controlled outside the rail. Omitting mobileNavigation preserves
 * the existing stacked layout for callers that have not opted in. */
export const ResponsiveNavigation: Story = { render: () => <MobileNavigationExample /> };

/** `AppShellBarEnd` sits at the bar's right end even when it is written first. */
export const BarEndWrittenFirst: Story = {
  render: () => (
    <AppShellMain>
      <AppShellBar>
        <AppShellBarEnd moreLabel="More">
          <Button variant="secondary">Export</Button>
        </AppShellBarEnd>
        <Breadcrumb label="Breadcrumb" items={[{ label: "Workspace", href: "#/workspace" }, { label: "Overview" }]} />
      </AppShellBar>
      <AppShellContent>
        <h1>Overview</h1>
      </AppShellContent>
    </AppShellMain>
  ),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector(".di-topbar")!;
    await expect(bar.lastElementChild).toHaveClass("di-top-actions");
    const crumbs = bar.firstElementChild!.getBoundingClientRect();
    await expect(bar.lastElementChild!.getBoundingClientRect().left).toBeGreaterThan(crumbs.left);
  },
};
