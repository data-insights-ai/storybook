import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { sampleChrome } from "../sample/chrome";
import { Button } from "./Button";
import { Menu, MenuGroup, MenuItem } from "./Menu";
import { useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { PageHeader, PageHeaderTitle } from "./Heading";
import { Select } from "./Select";
import { StatusPill } from "./StatusPill";
import {
  AppShell,
  AppShellBar,
  AppShellBarEnd,
  AppShellContent,
  AppShellContext,
  AppShellFoot,
  AppShellMain,
  AppShellRail,
  Console,
  ConsoleFrame,
  type NavGroup,
} from "./AppShell";

/* The sample sections, as a product hands them over: every item a link. */
const linkedGroups: NavGroup[] = sampleChrome.groups.map((group) => ({
  ...group,
  items: group.items.map((item) => ({ ...item, href: `#/${item.id}` })),
}));

const meta = {
  title: "Patterns/AppShell",
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
          <Breadcrumb
            label="Breadcrumb"
            items={[{ label: "WS-01", href: "#/overview" }, { label: "findings" }]}
          />
          <AppShellBarEnd>
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
 * `width="full"`: the page follows the window instead of stopping at
 * 1440px, for a console whose registers and charts use every column.
 */
export const FullWidth: Story = {
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
        <AppShellContent width="full">
          <PageHeader eyebrow="Record" lede="The page runs to the edge of the window.">
            <PageHeaderTitle>Findings</PageHeaderTitle>
          </PageHeader>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvasElement }) => {
    const main = within(canvasElement).getByRole("main");
    await expect(getComputedStyle(main).maxWidth).toBe("none");
  },
};

/**
 * The shell inside its window, with the sample chrome every screen in this
 * Storybook shares: an operator, a demo-data switch, a refresh, the seal.
 */
export const Chrome: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Console title="Overview" crumb={["Monitor", "Overview"]} active="overview" chrome={sampleChrome}>
      <h1 className="di-sr">Overview</h1>
      <p>The rail, the tenant, and the runtime stay on every page. The content below is what changes.</p>
    </Console>
  ),
};

/**
 * The canvas and the window on their own. A product renders `AppShell`
 * full-bleed; these stories sit it on the dotted ground so the console
 * reads as one object rather than as the page itself.
 */
export const Frame: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ConsoleFrame title="Overview" lang="en">
      <div style={{ padding: 24 }}>
        <h1 className="di-sr">Console frame</h1>
        <p>Whatever a product puts in the window goes here.</p>
      </div>
    </ConsoleFrame>
  ),
};

/** Persistent context stays before navigation in both layout and keyboard order. */
export const WithContext: Story = {
  render: (args) => <AppShell {...args}>
    <AppShellRail workspace="Register" workspaceId="" navLabel="Sections" groups={linkedGroups} active="findings" sealedMark={sampleChrome.sealedMark}>
      <AppShellFoot><span>Local runtime</span></AppShellFoot>
      <AppShellContext>
        <Select id="context-organization" label="Organization" labelTrack="prose" mono={false} defaultValue="studio"><option value="studio">Example studio</option><option value="lab">Example lab</option></Select>
        <Select id="context-workspace" label="Workspace" labelTrack="prose" mono={false} defaultValue="operations"><option value="operations">Operations</option><option value="research">Research</option></Select>
      </AppShellContext>
    </AppShellRail>
    <AppShellMain><AppShellContent><h1>Workspace overview</h1><p>Context remains visible as the page changes.</p></AppShellContent></AppShellMain>
  </AppShell>,
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
  const luminance = (channels: number[]) => channels.slice(0, 3).map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  const ink = luminance(rgba(getComputedStyle(element).color));
  const paper = luminance(ground(element));
  return (Math.max(ink, paper) + 0.05) / (Math.min(ink, paper) + 0.05);
}

const buttonVariants = ["primary", "secondary", "ghost", "danger", "seal", "inferred"] as const;

function ContextControls({ theme }: { theme: "light" | "dark" }) {
  return <div data-theme={theme}>
    <AppShell skipLabel="Skip to content">
      <AppShellRail workspace="Register" workspaceId="" navLabel="Sections" groups={[]} active="">
        <AppShellContext>
          {buttonVariants.map(variant => <Button key={variant} variant={variant}>{variant} action</Button>)}
          <Button disabled={true}>Unavailable action</Button>
        </AppShellContext>
      </AppShellRail>
      <AppShellMain><AppShellContent><h1>Context controls</h1><p>Sidebar controls retain readable surfaces in either page theme.</p></AppShellContent></AppShellMain>
    </AppShell>
  </div>;
}

const contextContrastPlay: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  for (const variant of buttonVariants) {
    const button = canvas.getByRole("button", { name: variant + " action" });
    await expect(textContrast(button)).toBeGreaterThanOrEqual(4.5);
    await userEvent.hover(button);
    // Wait for actual CSS hover transitions, rather than checking their first frame.
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await waitFor(() => expect(button.getAnimations().some(animation => animation.playState === "running")).toBe(false));
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
    return <AppShell {...args}>
      <AppShellRail workspace="Register" workspaceId="" navLabel="Sections" groups={[]} active="">
        <AppShellContext>
          <Menu open={open} onOpenChange={setOpen} align="start" label="Choose workspace" trigger={props => <Button {...props} variant="secondary">Workspace</Button>}>
            <MenuGroup label="Example studio with a deliberately long organization name">
              <MenuItem checked={workspace === "operations"} onSelect={() => setWorkspace("operations")}>International operations and monitoring workspace</MenuItem>
              <MenuItem checked={workspace === "research"} onSelect={() => setWorkspace("research")}>ResearchWorkspaceWithAnUnbrokenNameThatMustStillFitItsContainer</MenuItem>
            </MenuGroup>
          </Menu>
        </AppShellContext>
      </AppShellRail>
      <AppShellMain><AppShellContent><h1>Workspace context</h1></AppShellContent></AppShellMain>
    </AppShell>;
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
    await expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(canvas.getByRole("complementary").getBoundingClientRect().right);
  },
};
