import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { RegisterScreen } from "./Register";
import { toolbarRows } from "../../components/actions/Toolbar/rows.sample";

const meta = {
  title: "Patterns/Register",
  tags: ["layer:screen", "!autodocs"],
  component: RegisterScreen,
  parameters: { layout: "fullscreen" },
  args: { state: "ready", lang: "en" },
} satisfies Meta<typeof RegisterScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The bar stays one row and nothing on the page runs past the window, whatever the width and the words. */
async function holdsTheWidth(canvasElement: HTMLElement) {
  const doc = canvasElement.ownerDocument;
  const bar = canvasElement.querySelector<HTMLElement>(".di-topbar")!;
  await expect(bar.getBoundingClientRect().height).toBe(
    parseFloat(getComputedStyle(bar).getPropertyValue("--di-shell-bar-height")),
  );
  await expect(doc.documentElement.scrollWidth).toBeLessThanOrEqual(doc.documentElement.clientWidth);
  const toolbar = canvasElement.querySelector<HTMLElement>(".di-toolbar");
  if (toolbar) {
    const edge = toolbar.getBoundingClientRect().right;
    for (const part of toolbar.querySelectorAll<HTMLElement>(".di-tag, .di-search, .di-btn")) {
      await expect(part.getBoundingClientRect().right, part.className).toBeLessThanOrEqual(edge + 0.5);
    }
  }
}

/**
 * The register: the header names the page and its state, the expiring key
 * is the one thing that needs the reader, the figures sit on a strip, and
 * the table is the page. On a phone the navigation is a drawer behind the
 * menu button, and the bar's status folds into "More" beside the bell.
 */
export const Sources: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Sources on record" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 1, name: "Sources" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Notifications, 3 unread" })).toBeVisible();
    await holdsTheWidth(canvasElement);
  },
};

/** A row pressed: its detail opens in a side dialog that names the source, and Esc closes it. */
export const OpenRow: Story = {
  name: "Open row",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("feed.example.io"));
    const body = within(canvasElement.ownerDocument.body);
    const title = await body.findByRole("heading", { level: 2, name: "feed.example.io" });
    await waitFor(() => expect(title).toBeVisible());
    await expect(body.getByText("Rate limit from the upstream host")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("heading", { level: 2, name: "feed.example.io" })).toBeNull());
  },
};

/** After dark: the committing button turns paper-white, because navy cannot act against a navy ground. */
export const Night: Story = {
  globals: { theme: "dark" },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("table", { name: "Sources on record" })).toBeVisible();
  },
};

/** A new workspace: no figures, no table, one way out. */
export const Empty: Story = {
  name: "No sources yet",
  args: { state: "empty" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("No sources yet");
    await expect(canvas.queryByRole("table")).toBeNull();
  },
};

/** The register is on its way: the table's shape holds the space, after 150ms. */
export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByRole("status")).toHaveTextContent("Loading the register");
  },
};

/** The register failed to load: it says so in place of the table, and offers the retry. */
export const LoadFailed: Story = {
  name: "Failed to load",
  args: { state: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("The register could not be loaded")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
  },
};

/** In German: the longest words the page carries, on every width. */
export const German: Story = {
  args: { lang: "de" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Erfasste Datenquellen" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Benachrichtigungen, 3 ungelesen" })).toBeVisible();
    await holdsTheWidth(canvasElement);
  },
};

/** German on the smallest phone: one-row bar, the bell visible, the filter row inside its toolbar. */
export const GermanPhone: Story = {
  name: "German (360)",
  args: { lang: "de" },
  parameters: {
    viewport: { options: { small: { name: "Small", styles: { width: "360px", height: "780px" }, type: "mobile" } } },
  },
  globals: { viewport: { value: "small", isRotated: false } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.ownerDocument.defaultView!.innerWidth).toBe(360);
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Weitere" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Benachrichtigungen, 3 ungelesen" })).toBeVisible();
    await holdsTheWidth(canvasElement);
    const rows = toolbarRows(canvas.getByRole("search", { name: "Register filtern" }));
    await expect(rows).toHaveLength(2);
    await expect(rows[0][0]).toHaveClass("di-search");
    await expect(rows[0]).toHaveLength(2);
  },
};
