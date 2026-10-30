import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { expect, userEvent, within } from "storybook/test";
import { TabNav, TabNavLink } from "./TabNav";

const meta = {
  title: "Navigation/Views/TabNav",
  component: TabNav,
  tags: ["layer:block", "autodocs"],
  args: { label: "Access", children: null },
} satisfies Meta<typeof TabNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { href: "#/access/grants", label: "Grants", badge: "12" },
  { href: "#/access/roles", label: "Roles" },
  { href: "#/access/administrators", label: "Administrators" },
];

function RouterLink({
  onNavigate,
  href = "",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

/** Each tab is a link with an address; the current one is marked as the page. */
export const Default: Story = {
  render: function Render(args) {
    const [current, setCurrent] = useState(tabs[0].href);
    return (
      <TabNav label={args.label}>
        {tabs.map((tab) => (
          <TabNavLink
            key={tab.href}
            href={tab.href}
            badge={tab.badge}
            active={tab.href === current}
            render={<RouterLink onNavigate={setCurrent} />}
          >
            {tab.label}
          </TabNavLink>
        ))}
      </TabNav>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Access" });
    await expect(within(nav).getByRole("link", { name: /Grants/ })).toHaveAttribute("aria-current", "page");
    await userEvent.click(within(nav).getByRole("link", { name: "Roles" }));
    await expect(within(nav).getByRole("link", { name: "Roles" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: /Grants/ })).not.toHaveAttribute("aria-current");
  },
};

/** A settings page on a phone, in German: the strip scrolls on its own and opens with the current section in view. */
export const LongLabelsOnAPhone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  args: { label: "Einstellungen" },
  render: (args) => (
    <TabNav label={args.label}>
      <TabNavLink href="#/settings/general">Allgemein</TabNavLink>
      <TabNavLink href="#/settings/notifications" badge="3">
        Benachrichtigungen
      </TabNavLink>
      <TabNavLink href="#/settings/retention" active>
        Aufbewahrungsrichtlinien
      </TabNavLink>
    </TabNav>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const strip = canvas.getByRole("navigation", { name: "Einstellungen" }).getBoundingClientRect();
    const current = canvas.getByRole("link", { name: "Aufbewahrungsrichtlinien" }).getBoundingClientRect();
    await expect(current.left).toBeGreaterThanOrEqual(strip.left - 1);
    await expect(current.right).toBeLessThanOrEqual(strip.right + 1);
    await expect(canvasElement.ownerDocument.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  },
};
