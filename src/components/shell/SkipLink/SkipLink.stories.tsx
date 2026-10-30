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
  render: (args) => <Frame {...args} words={english} />,
} satisfies Meta<typeof SkipLink>;

const english = {
  nav: "Sections",
  links: ["Overview", "Sources", "Settings"],
  title: "Sources",
  lede: "Every host the workspace reads from.",
};

const german = {
  nav: "Bereiche",
  links: ["Übersicht", "Datenquellen", "Einstellungen"],
  title: "Datenquellen",
  lede: "Jeder Host, von dem der Arbeitsbereich liest.",
};

function Frame({ words, ...args }: { label: string; target?: string; words: typeof english }) {
  return (
    <>
      <SkipLink {...args} />
      <nav aria-label={words.nav} style={{ display: "flex", gap: "var(--di-space-16)", padding: "var(--di-space-16)" }}>
        {words.links.map((link, i) => (
          <TextLink key={link} href={`#/${english.links[i].toLowerCase()}`}>
            {link}
          </TextLink>
        ))}
      </nav>
      <AppShellContent>
        <PageHeader lede={words.lede}>
          <PageHeaderTitle>{words.title}</PageHeaderTitle>
        </PageHeader>
      </AppShellContent>
    </>
  );
}

/** The focused link covers the whole navigation row: no part of a link it covers shows beside it. */
async function coversTheRow(link: HTMLElement, canvasElement: HTMLElement) {
  const band = link.getBoundingClientRect();
  const row = canvasElement.querySelector("nav")!.getBoundingClientRect();
  await expect(band.left).toBeLessThanOrEqual(row.left);
  await expect(band.right).toBeGreaterThanOrEqual(row.right);
  await expect(band.top).toBeLessThanOrEqual(row.top);
  await expect(band.bottom).toBeGreaterThanOrEqual(row.bottom);
}

export default meta;
type Story = StoryObj<typeof meta>;

/** The first Tab stop of the page: hidden until the keyboard reaches it, then shown over the navigation. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Skip to content" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await expect(link).toBeVisible();
    await coversTheRow(link, canvasElement);
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

/** German: the label is the product's, in its language, like the page behind it. */
export const German: Story = {
  args: { label: "Zum Inhalt springen" },
  render: (args) => <Frame {...args} words={german} />,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Zum Inhalt springen" });
    await userEvent.tab();
    await waitFor(() => expect(link).toHaveFocus());
    await coversTheRow(link, canvasElement);
  },
};
