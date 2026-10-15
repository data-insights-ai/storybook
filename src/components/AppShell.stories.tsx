import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { sampleChrome } from "../sample/chrome";
import { Breadcrumb } from "./Breadcrumb";
import { PageHeader, PageHeaderTitle } from "./Heading";
import { StatusPill } from "./StatusPill";
import {
  AppShell,
  AppShellBar,
  AppShellBarEnd,
  AppShellContent,
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
