import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Check, Plus, Trash2 } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { AppShellBar, AppShellBarEnd, AppShellBarKeep } from "../../shell/AppShellBar";
import { TextField } from "../../forms/text/TextField";
import { Button } from "./Button";

const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--di-gap-8)" } as const;

const meta = {
  title: "Actions/Button",
  component: Button,
  tags: ["layer:primitive", "autodocs"],
  args: {
    children: "Add entry",
    variant: "primary",
    size: "md",
    type: "button",
    iconOnly: false,
    loading: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "ghost", "link", "danger", "seal", "inferred"],
    },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    type: { control: "radio", options: ["button", "submit", "reset"] },
    iconOnly: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Navy fill. The one control on the sheet that commits. */
export const Primary: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Add entry" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Filter" },
};

/**
 * A quiet button among other controls: Cancel beside the action the form
 * exists for. No frame and no underline (an underline says link); a ground
 * on hover.
 */
export const Ghost: Story = {
  args: { variant: "ghost", children: "Cancel" },
  render: (args) => (
    <div style={{ ...row, justifyContent: "flex-end", maxWidth: 480 }}>
      <Button {...args} />
      <Button variant="primary">Save changes</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const ghost = within(canvasElement).getByRole("button", { name: "Cancel" });
    await expect(getComputedStyle(ghost).textDecorationLine).toBe("none");
  },
};

/**
 * Drawn as a `TextLink`: an action that reads as a word, beside a field or
 * in a sentence. It takes the size of its line; no size, icon-only, badge,
 * key cap or spinner.
 */
export const LinkLook: Story = {
  args: { variant: "link", children: "Send it again" },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--di-gap-8)", maxWidth: 360 }}>
      <TextField id="code" label="Verification code" hint="Six digits, sent to m****@data-insights.ai" />
      <p style={{ margin: 0, fontSize: "var(--di-font-size-300)", color: "var(--di-text-muted)" }}>
        No code yet? <Button {...args} />
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("button", { name: "Send it again" });
    await expect(link).toHaveClass("di-textlink");
    await expect(getComputedStyle(link).textDecorationLine).toBe("underline");
  },
};

/** The same in German, where the sentence wraps and the link wraps with it. */
export const LinkLookGerman: Story = {
  args: { variant: "link", children: "Code erneut senden" },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--di-gap-8)", maxWidth: 300 }}>
      <TextField id="code-de" label="Bestätigungscode" hint="Sechs Ziffern, gesendet an m****@data-insights.ai" />
      <p style={{ margin: 0, fontSize: "var(--di-font-size-300)", color: "var(--di-text-muted)" }}>
        Noch kein Code angekommen? <Button {...args} />
      </p>
    </div>
  ),
};

/**
 * A count after the icon: unread notifications in the app bar. The button
 * widens for the count, so "99+" covers neither the bell nor a neighbour;
 * `badgeLabel` adds the count in words to the name.
 */
export const WithBadge: Story = {
  args: { children: "" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: "grid", gap: "var(--di-gap-16)" }}>
      {[
        { count: 0, words: "" },
        { count: 3, words: "3 unread" },
        { count: 128, words: "128 unread" },
      ].map(({ count, words }) => (
        <AppShellBar key={count}>
          <span>Signals</span>
          <AppShellBarEnd moreLabel="More">
            <AppShellBarKeep>
              <Button variant="ghost" iconOnly aria-label="Notifications" badge={count} badgeLabel={words}>
              <Bell aria-hidden />
            </Button>
            </AppShellBarKeep>
          </AppShellBarEnd>
        </AppShellBar>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Notifications" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Notifications, 3 unread" })).toHaveTextContent("3");
    const many = canvas.getByRole("button", { name: "Notifications, 128 unread" });
    await expect(many).toHaveTextContent("99+");
    const icon = many.querySelector("svg")!.getBoundingClientRect();
    const badge = many.querySelector(".di-badge")!.getBoundingClientRect();
    const frame = many.getBoundingClientRect();
    await expect(badge.left).toBeGreaterThanOrEqual(icon.right);
    await expect(badge.right).toBeLessThanOrEqual(frame.right);
    await expect(badge.top).toBeGreaterThanOrEqual(frame.top);
  },
};

/** German labels, as long as they come: the count and the name stay on one line. */
export const WithBadgeGerman: Story = {
  args: { children: "" },
  parameters: { controls: { disable: true } },
  render: () => (
    <AppShellBar>
      <span>Benachrichtigungseinstellungen</span>
      <AppShellBarEnd moreLabel="Weitere">
        <AppShellBarKeep>
          <Button variant="ghost" iconOnly aria-label="Benachrichtigungen" badge={12} badgeLabel="12 ungelesen">
          <Bell aria-hidden />
        </Button>
        </AppShellBarKeep>
      </AppShellBarEnd>
    </AppShellBar>
  ),
};

/** Reads as an ordinary control until hover. A red fill invites the press. */
export const Danger: Story = {
  args: { variant: "danger", children: "Revoke key" },
};

/** A brand moment: sign-in, onboarding, a licence or a certificate. Never in an operational view. */
export const Seal: Story = {
  args: { variant: "seal", children: "Seal entry" },
};

/** Acts on a model's proposal, so it carries the ring's edge. */
export const Inferred: Story = {
  args: { variant: "inferred", children: "Accept suggestion" },
};

/** A row or a toolbar of small controls. */
export const Small: Story = {
  args: { size: "sm", variant: "secondary", children: "Export" },
};

/** A sign-in or a brand page. */
export const Large: Story = {
  args: { size: "lg", children: "Sign in" },
};

export const WithIcon: Story = {
  args: { children: "Add entry" },
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Plus aria-hidden />
      {children}
    </Button>
  ),
};

/** Icon only, so the name has to be spelled out for a screen reader. */
export const IconOnly: Story = {
  args: { iconOnly: true, variant: "secondary", children: "" },
  render: (args) => (
    <Button {...args} aria-label="Remove entry">
      <Trash2 aria-hidden />
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Remove entry" })).toBeVisible();
  },
};

/** Busy and unpressable. `aria-busy` says so without a second label. */
export const Loading: Story = {
  args: { loading: true, children: "Sealing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Sealing" });
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  },
};

/**
 * A shortcut shows its key beside the label. Screen readers hear it through
 * `aria-keyshortcuts`, so the key never becomes part of the button's name.
 */
export const Shortcut: Story = {
  args: { shortcut: "n", children: "New entry" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "New entry" });
    await expect(button).toHaveAttribute("aria-keyshortcuts", "n");
    await expect(button).toHaveTextContent("New entryN");
  },
};

/**
 * An `href` makes it an `<a>`: same control, and the browser's own
 * navigation — open in a new tab, copy the address, a real status bar.
 */
export const Navigates: Story = {
  args: { children: "Open record" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => (
    <Button href="#/register/0148" variant="secondary">
      {children}
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Open record" });
    await expect(link).toHaveAttribute("href", "#/register/0148");
  },
};

/** A blocked link drops its `href`, so there is nothing left to follow. */
export const NavigatesBlocked: Story = {
  args: { children: "Unavailable" },
  parameters: { controls: { disable: true } },
  render: ({ children }) => (
    <Button href="#/register/0148" variant="secondary" disabled={true}>
      {children}
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByText("Unavailable");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).not.toHaveAttribute("href");
  },
};

/** Every variant at once, for a pass over the whole set. */
export const AllVariants: Story = {
  args: { children: "" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Button variant="primary">
        <Check aria-hidden />
        Commit
      </Button>
      <Button variant="secondary">Filter</Button>
      <Button variant="ghost">Refresh</Button>
      <Button variant="link">Show details</Button>
      <Button variant="danger">Revoke key</Button>
      <Button variant="seal">Seal entry</Button>
      <Button variant="inferred">Accept suggestion</Button>
      <Button variant="primary" loading={true}>
        Sealing
      </Button>
      <Button variant="secondary" disabled={true}>
        Unavailable
      </Button>
      <Button variant="danger" disabled={true}>
        Delete organization
      </Button>
    </div>
  ),
};

/**
 * After dark the fill turns paper-white: navy has nothing left to act against.
 *
 * The ground is a `data-theme="dark"` region rather than the whole canvas,
 * so the night sheet can be shown beside daylight — and so this story is a
 * render rather than a toolbar state.
 */
export const NightSheet: Story = {
  args: { children: "" },
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      data-theme="dark"
      style={{
        ...row,
        padding: "var(--di-space-16)",
        borderRadius: "var(--di-radius-surface)",
        background: "var(--di-bg-page)",
      }}
    >
      <Button variant="primary">
        <Check aria-hidden />
        Commit
      </Button>
      <Button variant="secondary">Filter</Button>
      <Button variant="ghost">Refresh</Button>
      <Button variant="link">Show details</Button>
      <Button variant="danger">Revoke key</Button>
      <Button variant="seal">Seal entry</Button>
      <Button variant="inferred">Accept suggestion</Button>
      <Button variant="secondary" disabled={true}>
        Unavailable
      </Button>
    </div>
  ),
};
