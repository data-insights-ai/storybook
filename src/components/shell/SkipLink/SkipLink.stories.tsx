import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { PageHeader, PageHeaderTitle } from "../../layout/page/PageHeader";
import { TextLink } from "../../text/TextLink";
import { AppShellContent } from "../AppShellContent";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "Shell/SkipLink",
  component: SkipLink,
  tags: ["layer:primitive", "autodocs"],
  parameters: { layout: "fullscreen" },
  args: { label: "Skip to content", target: "di-content" },
  argTypes: { label: { control: "text" }, target: { control: "text" } },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <nav aria-label="Sections" style={{ display: "flex", gap: "var(--di-space-16)", padding: "var(--di-space-16)" }}>
        <TextLink href="#/overview">Overview</TextLink>
        <TextLink href="#/sources">Sources</TextLink>
        <TextLink href="#/settings">Settings</TextLink>
      </nav>
      <AppShellContent>
        <PageHeader lede="Every host the workspace reads from.">
          <PageHeaderTitle>Sources</PageHeaderTitle>
        </PageHeader>
      </AppShellContent>
    </>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The first Tab stop of the page: hidden until the keyboard reaches it, then shown over the navigation. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Skip to content" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await expect(link).toBeVisible();
  },
};

/** Enter moves focus past the navigation to the page, which shows no ring of its own. */
export const Skipped: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Skip to content" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    const main = canvasElement.ownerDocument.getElementById("di-content")!;
    await waitFor(() => expect(main).toHaveFocus());
    await expect(getComputedStyle(main).outlineStyle).toBe("none");
  },
};

/** German: the label is the product's, in its language. */
export const German: Story = {
  args: { label: "Zum Inhalt springen" },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await waitFor(() => expect(within(canvasElement).getByRole("link", { name: "Zum Inhalt springen" })).toHaveFocus());
  },
};
