import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Page } from "../../../layout/page/Page";
import { PageHeader, PageHeaderTitle } from "../../../layout/page/PageHeader";
import { Stack } from "../../../layout/arrange/Stack";
import { TextLink } from "../../TextLink";
import { Point, PointList } from "./PointList";

const meta = {
  title: "Text/Blocks/PointList",
  component: PointList,
  tags: ["layer:block", "autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "**Purpose:** a brand page's named points: a short heading over a paragraph, several side by side.",
          '**When to use:** three to six reasons to trust, what a release carries, what a plan includes. **When not to:** a term and its value is a `FactList` (`layout="grid"` for stated facts); a real sequence is `Steps`; a product screen.',
          "**Anatomy:** `PointList` (a `ul`) holding `Point`s, each a heading (`title`) and the paragraph that says it (the child).",
          "**Size:** the heading 18 to 20px with the width of the list (`--di-brand-point-title-size`), the paragraph 16px (`--di-brand-point-body-size`). The points wrap at `--di-points-min` and a short last row shares the width.",
          "**Content rules:** a name of two to five words in sentence case, one or two sentences under it; no number, since the order is not information.",
          "**Accessibility:** a list, so its length is announced; every name is a heading at `heading`, the level under the section that holds the list.",
        ].join("\n\n"),
      },
    },
  },
  args: { heading: 3, label: "", children: null },
  argTypes: {
    heading: { control: "radio", options: [2, 3, 4] },
    label: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof PointList>;

export default meta;
type Story = StoryObj<typeof meta>;

const trust = [
  [
    "Every answer cites its source",
    "Each finding links to the records it was drawn from, with the time they were recorded.",
  ],
  ["Runs where your data is", "In the cloud region you choose, or on your own hardware behind your own firewall."],
  ["Sign-in you already run", "Your identity provider through SAML or OpenID Connect; no second set of passwords."],
  ["Works offline", "The licence and sign-in ship with the installer, so an isolated network needs no call home."],
] as const;

/**
 * Trust tiles under a brand section's head: four points, each heading an h3
 * under the section's h2. On a desk they share one row; on a phone they
 * read as one column.
 */
export const Default: Story = {
  render: (args) => (
    <Page width="full">
      <Stack gap={48}>
        <PageHeader level={2} tier="brand" eyebrow="Why teams trust it">
          <PageHeaderTitle>Built to be checked.</PageHeaderTitle>
        </PageHeader>
        <PointList {...args}>
          {trust.map(([title, body]) => (
            <Point key={title} title={title}>
              {body}
            </Point>
          ))}
        </PointList>
      </Stack>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    await expect(items).toHaveLength(4);
    await expect(within(list).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    const title = canvas.getByRole("heading", { name: "Works offline" });
    if (list.clientWidth >= 540) await expect(getComputedStyle(title).fontSize).toBe("20px");
    if (list.clientWidth <= 400) await expect(getComputedStyle(title).fontSize).toBe("18px");
    await expect(getComputedStyle(canvas.getByText(/^In the cloud region/)).fontSize).toBe("16px");
    const [first, second] = items.map((item) => item.getBoundingClientRect());
    if (window.innerWidth < 600) await expect(second.top).toBeGreaterThan(first.bottom);
    else await expect(second.top).toBe(first.top);
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  },
};

/**
 * The heading level is the page's, not the component's: straight under the
 * page's h1 the points are h2. `label` names the list where no heading
 * above it does. Five points in rows of four end in one wider point, not an
 * empty cell.
 */
export const Levels: Story = {
  args: { heading: 2, label: "What every release carries" },
  render: (args) => (
    <Page width="full">
      <PointList {...args}>
        <Point title="Workload identity">
          Every service signs in as itself, with a certificate that rotates daily.
        </Point>
        <Point title="Audit log">Every change records who made it, from where and when, and cannot be edited.</Point>
        <Point title="Encryption">Data is encrypted in transit and at rest, with keys held apart from the data.</Point>
        <Point title="Least privilege">A role grants only what its work needs, on one workspace at a time.</Point>
        <Point title="Signed releases">
          Each image is signed and its build recorded; <TextLink href="#verify">verify a release</TextLink> before you
          install it.
        </Point>
      </PointList>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list", { name: "What every release carries" });
    await expect(within(list).getAllByRole("heading", { level: 2 })).toHaveLength(5);
    await expect(within(list).queryAllByRole("heading", { level: 3 })).toHaveLength(0);
    const items = within(list).getAllByRole("listitem");
    const first = items[0].getBoundingClientRect();
    const last = items[items.length - 1].getBoundingClientRect();
    if (last.top > first.top && items[1].getBoundingClientRect().top === first.top)
      await expect(last.width).toBeGreaterThan(first.width);
  },
};

/** Sized by its column, not the window: in a narrow column the heading drops to 18px on a desk too. */
export const NarrowColumn: Story = {
  args: { heading: 2 },
  render: (args) => (
    <Page width="full">
      <div style={{ maxWidth: 320 }}>
        <PointList {...args}>
          {trust.slice(0, 2).map(([title, body]) => (
            <Point key={title} title={title}>
              {body}
            </Point>
          ))}
        </PointList>
      </div>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const title = within(canvasElement).getByRole("heading", { name: trust[0][0] });
    await expect(getComputedStyle(title).fontSize).toBe("18px");
  },
};
