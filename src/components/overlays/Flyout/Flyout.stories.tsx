import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../../actions/Button";
import { AppShellBar, AppShellBarEnd, AppShellBarKeep } from "../../shell/AppShellBar";
import { Flyout, FlyoutFooter, FlyoutItem, FlyoutItems, FlyoutTrigger } from "./Flyout";
import { TextLink } from "../../text/TextLink";

const meta = {
  title: "Overlays/Flyout",
  component: Flyout,
  tags: ["layer:block", "autodocs"],
  subcomponents: { FlyoutItems, FlyoutItem, FlyoutFooter, FlyoutTrigger },
} satisfies Meta<typeof Flyout>;

export default meta;

const entries: { title: string; time: string; unread: boolean; detail?: string }[] = [
  { title: "Source North hub stopped collecting", time: "09:12", unread: true, detail: "Production · automatic" },
  { title: "Nora Feld granted Analyst on Operations", time: "08:47", unread: true, detail: "Operations · Alex Admin" },
  { title: "Workspace Lab renamed to Research", time: "Yesterday", unread: false },
  { title: "Export of the March register finished and is ready to download", time: "Mon", unread: false },
];

function Notifications({ routed = false }: { routed?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minHeight: 460 }}>
      <AppShellBar>
        <AppShellBarEnd moreLabel="More">
          <AppShellBarKeep>
            <Flyout id="latest" title="Notifications" open={open} onOpenChange={setOpen}>
              <FlyoutTrigger>
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label="Notifications"
                  badge={2}
                  badgeLabel="2 unread"
                  aria-expanded={open}
                  aria-controls="latest"
                  onClick={() => setOpen(!open)}
                >
                  <Bell aria-hidden />
                </Button>
              </FlyoutTrigger>
              <FlyoutItems label="Latest notifications" unreadLabel="unread">
                {entries.map((e) => (
                  <FlyoutItem
                    key={e.title}
                    title={e.title}
                    detail={e.detail}
                    time={e.time}
                    unread={e.unread}
                    // eslint-disable-next-line jsx-a11y/anchor-has-content -- the entry renders into the router's anchor
                    {...(routed ? { render: <a href="#entry" data-router="link" /> } : { href: "#entry" })}
                  />
                ))}
              </FlyoutItems>
              <FlyoutFooter>
                <TextLink href="#all">All notifications</TextLink>
                <Button variant="secondary" size="sm">
                  Mark all read
                </Button>
              </FlyoutFooter>
            </Flyout>
          </AppShellBarKeep>
        </AppShellBarEnd>
      </AppShellBar>
    </div>
  );
}

/**
 * The bell in the topbar opens the latest notifications. An unread entry is
 * a dot and a semibold title, a read one regular; the times line up in
 * their own column. Escape closes the panel and returns focus to the bell.
 */
export const FromTheTopbar: StoryObj = {
  render: () => <Notifications />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bell = canvas.getByRole("button", { name: "Notifications, 2 unread" });
    await userEvent.click(bell);
    const panel = await canvas.findByRole("dialog", { name: "Notifications" });
    await expect(bell).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(panel).toHaveFocus());
    await waitFor(() => expect(getComputedStyle(panel).opacity).toBe("1"));
    await expect(
      within(panel).getByRole("link", { name: /^Source North hub stopped collecting\s*, unread/ }),
    ).toBeVisible();
    await expect(
      within(panel).getByRole("link", { name: /^Workspace Lab renamed to Research\s*Yesterday$/ }),
    ).toBeVisible();
    // The times share one right edge, and the dot column starts at the heading's edge.
    const times = Array.from(panel.querySelectorAll(".di-flyout-item-time")).map((t) =>
      Math.round(t.getBoundingClientRect().right),
    );
    await expect(new Set(times).size).toBe(1);
    const title = panel.querySelector(".di-flyout-title")!;
    const heading = title.getBoundingClientRect().left + parseFloat(getComputedStyle(title).paddingLeft);
    const mark = panel.querySelector(".di-flyout-item-mark")!.getBoundingClientRect().left;
    await expect(Math.round(mark)).toBe(Math.round(heading));
    await userEvent.keyboard("{Escape}");
    await expect(canvas.queryByRole("dialog")).toBeNull();
    await expect(bell).toHaveFocus();
    await userEvent.click(bell);
    const again = await canvas.findByRole("dialog", { name: "Notifications" });
    await waitFor(() => expect(getComputedStyle(again).opacity).toBe("1"));
  },
};

/** A router's link component renders each entry's `<a>`, so opening a record from the panel needs no page load. */
export const WithRouterLinks: StoryObj = {
  render: () => <Notifications routed />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Notifications, 2 unread" }));
    const panel = await canvas.findByRole("dialog", { name: "Notifications" });
    const entry = within(panel).getByRole("link", { name: /^Workspace Lab renamed to Research/ });
    await expect(entry).toHaveAttribute("data-router", "link");
    await expect(entry).toHaveClass("di-flyout-item", "di-row");
  },
};
