import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Page } from "../../layout/page/Page";
import { PageHeader, PageHeaderCrumbs, PageHeaderTitle } from "../../layout/page/PageHeader";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["layer:primitive", "autodocs"],
  decorators: [
    (Story, { args }) => (
      <Page width="full">
        <PageHeader>
          <PageHeaderCrumbs>
            <Story />
          </PageHeaderCrumbs>
          <PageHeaderTitle>{args.items[args.items.length - 1]?.label}</PageHeaderTitle>
        </PageHeader>
      </Page>
    ),
  ],
  args: {
    label: "Breadcrumb",
    items: [
      { label: "Example studio", href: "#/workspace" },
      { label: "Sources", href: "#/sources" },
      { label: "feed.example.io" },
    ],
  },
  argTypes: {
    label: { control: "text" },
    maxItems: { control: { type: "number", min: 2 } },
    collapseLabel: { control: "text" },
    items: { control: false },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Linked ancestors are underlined, because they open; the current page is not a link. */
export const Default: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.querySelector("nav")!);
    await expect(canvas.getByText("feed.example.io")).toHaveAttribute("aria-current", "page");
    await expect(getComputedStyle(canvas.getByRole("link", { name: "Sources" })).textDecorationLine).toBe("underline");
  },
};

/** One level: the breadcrumb is still the answer to "where am I". */
export const Root: Story = {
  args: { items: [{ label: "Overview" }] },
};

/** A deep path folds its middle into one "…" that shows the rest, and stays on one line. */
export const Folded: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: {
    collapseLabel: "Show the full path",
    items: [
      { label: "Example studio", href: "#/workspace" },
      { label: "Sources", href: "#/sources" },
      { label: "Syslog", href: "#/sources/syslog" },
      { label: "Collectors", href: "#/sources/syslog/collectors" },
      { label: "col-eu-02" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("link", { name: "Sources" })).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Show the full path" }));
    await expect(canvas.getByRole("link", { name: "Sources" })).toBeVisible();
  },
};

/** A router's link component renders each ancestor's `<a>`, so going up the path needs no page load. */
export const WithRouterLinks: Story = {
  globals: { viewport: { value: "desk", isRotated: false } },
  args: {
    items: [
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- the crumb renders its label into the router's anchor
      { label: "Example studio", render: <a href="#/workspace" data-router="link" /> },
      // eslint-disable-next-line jsx-a11y/anchor-has-content -- the crumb renders its label into the router's anchor
      { label: "Sources", render: <a href="#/sources" data-router="link" /> },
      { label: "feed.example.io" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.querySelector("nav")!);
    const sources = canvas.getByRole("link", { name: "Sources" });
    await expect(sources).toHaveAttribute("data-router", "link");
    await expect(sources).toHaveClass("di-breadcrumb-link");
    await expect(getComputedStyle(sources).textDecorationLine).toBe("underline");
  },
};

/** Without links, where the trail states a position but does not navigate: no underline. */
export const Static: Story = {
  args: {
    items: [{ label: "Example studio" }, { label: "Sources" }, { label: "feed.example.io" }],
  },
};

/**
 * Long German names in a narrow bar: one line, the ancestors give way
 * first, the page name truncates last.
 */
export const LongLabels: Story = {
  args: {
    label: "Pfad",
    items: [
      { label: "Arbeitsbereich Nordwind Sicherheit", href: "#/workspace" },
      { label: "Benachrichtigungen", href: "#/notifications" },
      { label: "Aufbewahrungsrichtlinien für Protokolldaten" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector<HTMLElement>(".di-breadcrumb-list")!;
    const lineHeight = parseFloat(getComputedStyle(list).lineHeight);
    await expect(list.getBoundingClientRect().height).toBeLessThanOrEqual(lineHeight + 1);
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
  },
};

/** On a phone, above the title, one line: the way back up to the parent, long labels truncated. */
export const OnAPhone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  args: LongLabels.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.querySelector("nav")!);
    await expect(canvas.getByRole("link", { name: "Benachrichtigungen" })).toBeVisible();
    await expect(canvas.getByText("Aufbewahrungsrichtlinien für Protokolldaten")).not.toBeVisible();
    await expect(canvas.queryByRole("link", { name: "Arbeitsbereich Nordwind Sicherheit" })).toBeNull();
    const list = canvasElement.querySelector<HTMLElement>(".di-breadcrumb-list")!;
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
  },
};

/**
 * On a phone, above the page's title: the way back up to the parent, not the
 * current page again.
 */
export const PhoneBackLink: Story = {
  name: "Phone back link",
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.querySelector("nav")!);
    await expect(canvas.getByRole("link", { name: "Sources" })).toBeVisible();
    await expect(canvas.getByText("feed.example.io")).not.toBeVisible();
    await expect(canvas.queryByRole("link", { name: "Example studio" })).toBeNull();
  },
};
