import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["layer:primitive", "autodocs"],
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
    const canvas = within(canvasElement);
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

/** On a phone only the page itself shows, on one line: the drawer is the way back up. */
export const OnAPhone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  args: LongLabels.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Aufbewahrungsrichtlinien für Protokolldaten")).toBeVisible();
    await expect(canvas.queryByRole("link", { name: "Benachrichtigungen" })).toBeNull();
    const list = canvasElement.querySelector<HTMLElement>(".di-breadcrumb-list")!;
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
  },
};
