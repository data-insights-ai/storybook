import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Page } from "../../layout/page/Page";
import { Panel, PanelFooter, PanelLead } from "../../layout/page/Panel";
import { Figure, FigureNote } from "../Figure";
import { FigureRow } from "./FigureRow";

const meta = {
  title: "Figures/FigureRow",
  component: FigureRow,
  tags: ["layer:block", "autodocs"],
  args: { label: "Case figures", variant: "strip", size: "regular", children: null },
  argTypes: {
    label: { control: "text" },
    variant: { control: "radio", options: ["footer", "strip"] },
    size: { control: "radio", options: ["regular", "compact"] },
    children: { control: false },
  },
  decorators: [
    (Story, { args }) =>
      args.variant === "footer" ? (
        <Panel surface="hero" title="Cases this week" heading={2}>
          <PanelLead>Three bursts this week, the largest on 9 October.</PanelLead>
          <PanelFooter>
            <Story />
          </PanelFooter>
        </Panel>
      ) : (
        <Page width="full">
          <Story />
        </Page>
      ),
  ],
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="Signals" value="1,064">
        12 rules
      </Figure>
      <Figure label="Hosts" value="39" tone="danger">
        <FigureNote tone="danger">36 in finance</FigureNote>
      </Figure>
      <Figure label="Accounts" value="4">
        svc-backup most active
      </Figure>
      <Figure label="Score" value="98" unit="of 100" />
    </FigureRow>
  ),
} satisfies Meta<typeof FigureRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every row holds as many figures as the first (no 2 + 1), and every value stands on one line. */
async function expectEvenRows(canvasElement: HTMLElement) {
  await document.fonts.ready;
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  const figures = Array.from(canvasElement.querySelectorAll<HTMLElement>(".di-figure"));
  const rows = new Map<number, number>();
  for (const figure of figures) {
    const top = Math.round(figure.getBoundingClientRect().top);
    rows.set(top, (rows.get(top) ?? 0) + 1);
  }
  await expect(new Set(rows.values()).size).toBe(1);
  for (const value of canvasElement.querySelectorAll<HTMLElement>(".di-figure-value")) {
    const height = value.getBoundingClientRect().height;
    await expect(height).toBeLessThan(parseFloat(getComputedStyle(value).fontSize) * 2);
    await expect(value.scrollWidth).toBeLessThanOrEqual(value.clientWidth + 1);
  }
}

/** Figures without a hero sit on a strip a step below the ground; one description list for the row. */
export const Strip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("1,064")).toBeVisible();
    await expect(canvasElement.querySelectorAll("dl")).toHaveLength(1);
    const first = canvasElement.querySelector(".di-figure") as HTMLElement;
    const list = canvasElement.querySelector(".di-figure-list") as HTMLElement;
    await expect(first.getBoundingClientRect().left).toBeLessThan(list.getBoundingClientRect().left);
    await expectEvenRows(canvasElement);
    const note = canvas.getByText("36 in finance");
    await expect(getComputedStyle(note).fontFamily).toContain("IBM Plex Sans");
    await expect(getComputedStyle(note).fontVariantNumeric).toBe("tabular-nums");
  },
};

/** Under a hero the row is its footer: no band, the hero's rule above it. */
export const Footer: Story = {
  args: { variant: "footer" },
  play: async ({ canvasElement }) => {
    await expectEvenRows(canvasElement);
  },
};

/** A quiet health line at the foot of a page: values in the body size, amber only on the failing one. */
export const Compact: Story = {
  args: { label: "Delivery", size: "compact" },
  render: (args) => (
    <FigureRow {...args}>
      <Figure label="Notifications" value="2 of 2 active" />
      <Figure label="SIEM exports" value="1 of 2 delivering" tone="warn" />
      <Figure label="Access" value="8 people and service accounts" />
    </FigureRow>
  ),
  play: async ({ canvasElement }) => {
    const value = within(canvasElement).getByText("2 of 2 active");
    await expect(parseFloat(getComputedStyle(value).fontSize)).toBe(14);
    await expectEvenRows(canvasElement);
  },
};
