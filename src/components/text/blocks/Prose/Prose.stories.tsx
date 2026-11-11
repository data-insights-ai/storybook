import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CiteMark } from "../CiteMark";
import { SourceEntry, SourceList } from "../SourceList";
import { TextLink } from "../../TextLink";
import { Prose, ProseLede } from "./Prose";
import { onPanel } from "../../../../../.storybook/onPanel";

const meta = {
  title: "Text/Blocks/Prose",
  component: Prose,
  tags: ["layer:block", "autodocs"],
  args: { children: null },
  argTypes: { children: { control: false } },
  decorators: [onPanel("Example Widget: remote code execution")],
  render: () => (
    <>
      <Prose>
        <ProseLede>
          <p>
            CISA lists the flaw as exploited: attackers run code on Example Widget gateways without signing in.
            <CiteMark n={1} href="#src-1" label="Source 1: CISA" />
          </p>
        </ProseLede>
        <p>
          Gateways accept a crafted request that runs code as the service user, before any sign-in.
          <CiteMark n={2} href="#src-2" label="Source 2: CVE-2026-1234" />
        </p>
        <h2>Am I affected?</h2>
        <p>
          Gateways on 4.0 up to 4.2.0 are affected when their management port is reachable. Check the version with{" "}
          <code>widgetctl --version</code>.
          <CiteMark n={2} href="#src-2" label="Source 2: CVE-2026-1234" />
        </p>
        <h2>Fix</h2>
        <ul>
          <li>Update to 4.2.1.</li>
          <li>Until then, keep the management port off the internet.</li>
        </ul>
      </Prose>
      <SourceList>
        <SourceEntry n={1} id="src-1">
          <span>CISA</span>
          <TextLink href="https://www.cisa.gov/">https://www.cisa.gov/</TextLink>
        </SourceEntry>
        <SourceEntry n={2} id="src-2">
          <TextLink plain href="#">
            CVE-2026-1234
          </TextLink>
        </SourceEntry>
      </SourceList>
    </>
  ),
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An article: the 18px lede, 16px body to about 68 characters, display heads set apart by space, numbered citations leading to the sources. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mark = canvas.getAllByRole("link", { name: "Source 1: CISA" })[0];
    await expect(mark).toHaveAttribute("href", "#src-1");
    await expect(canvasElement.querySelector("#src-1")).toBeTruthy();
    const body = canvasElement.querySelector(".di-prose p:not(.di-prose-lede p)")!;
    await expect(getComputedStyle(body).fontSize).toBe("16px");
    const lede = getComputedStyle(canvasElement.querySelector(".di-prose-lede")!);
    await expect(lede.fontSize).toBe("18px");
    await expect(getComputedStyle(canvasElement.querySelector(".di-prose")!).maxWidth).not.toBe("none");
    await expect(getComputedStyle(canvas.getByText("Am I affected?")).fontFamily).toContain(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--di-font-display")
        .split(",")[0]
        .trim()
        .replace(/"/g, ""),
    );
  },
};

/** On a phone the measure is the column. */
export const Phone: Story = {
  parameters: { viewport: { value: "phone" } },
};
