import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { expect, userEvent, within } from "storybook/test";
import { TabNav, TabNavLink } from "./TabNav";

const meta = {
  title: "Navigation/TabNav",
  component: TabNav,
  tags: ["autodocs"],
  args: { label: "Access", children: null },
} satisfies Meta<typeof TabNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabs = [
  { href: "#/access/grants", label: "Grants", badge: "12" },
  { href: "#/access/roles", label: "Roles" },
  { href: "#/access/administrators", label: "Administrators" },
];

function RouterLink({ onNavigate, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate: (href: string) => void }) {
  return (
    <a
      {...props}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onNavigate(props.href ?? "");
      }}
    />
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
