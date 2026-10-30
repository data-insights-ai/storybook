import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Copy, Download, Search } from "lucide-react";
import {
  Button,
  Fact,
  FactList,
  Figure,
  FigureRow,
  Kbd,
  MetaLine,
  Panel,
  Stack,
  PanelStatus,
  PanelNote,
  StatusPill,
  Toolbar,
} from "../../index";
import { Doc, DocSection, Example, Rules } from "../guide/Doc";
import { TokenTable } from "../guide/Tokens";

const sample = (style: CSSProperties, text: string) => <span style={{ whiteSpace: "nowrap", ...style }}>{text}</span>;

const display = { fontFamily: "var(--di-font-display)", fontWeight: 700, letterSpacing: "var(--di-tracking-tight)" };
const sans = { fontFamily: "var(--di-font-ui)" };
const mono = { fontFamily: "var(--di-font-code)", fontVariantNumeric: "tabular-nums" } as const;

const steps = [
  {
    token: "--di-font-size-700",
    use: "Space Grotesk 700: the page's name (PageHeader), a figure's value.",
    sample: sample({ ...display, fontSize: "var(--di-font-size-700)" }, "Sources"),
  },
  {
    token: "--di-font-size-600",
    use: "Space Grotesk 700: a section's heading (PageHeader level 2).",
    sample: sample({ ...display, fontSize: "var(--di-font-size-600)" }, "Delivery"),
  },
  {
    token: "--di-font-size-500",
    use: "Space Grotesk 700: a block's title (Panel, Dialog, AttentionItem).",
    sample: sample({ ...display, fontSize: "var(--di-font-size-500)" }, "Last delivery"),
  },
  {
    token: "--di-font-size-400",
    use: "IBM Plex Sans 400: the body, at 14px in both densities. 500 for a control's label.",
    sample: sample({ ...sans, fontSize: "var(--di-font-size-400)" }, "Paused after four rate limits."),
  },
  {
    token: "--di-font-size-300",
    use: "IBM Plex Sans: a field's hint, a panel's note. IBM Plex Mono: a meta line.",
    sample: sample({ ...sans, fontSize: "var(--di-font-size-300)" }, "Sealed entries stay on record."),
  },
  {
    token: "--di-font-size-200",
    use: "IBM Plex Mono 500 capitals, 0.1em: the label above a value.",
    sample: sample(
      {
        ...mono,
        fontWeight: 500,
        fontSize: "var(--di-font-size-200)",
        letterSpacing: "var(--di-tracking-label)",
        textTransform: "uppercase",
        color: "var(--di-text-muted)",
      },
      "Received",
    ),
  },
  {
    token: "--di-font-size-100",
    use: "IBM Plex Mono 500: a key cap (Kbd), the ordinal of a step.",
    sample: sample({ ...mono, fontWeight: 500, fontSize: "var(--di-font-size-100)" }, "⌘K"),
  },
];

function TypePage() {
  return (
    <Doc
      title="Type"
      lede="Three families, three jobs. Space Grotesk names: a page, a section, a block, a figure. IBM Plex Sans is what a person reads, at 14px. IBM Plex Mono is what a machine recorded, and the label above a value."
    >
      <DocSection
        title="In use"
        lede="One panel, all three families. The title is the one bold line; the labels are mono capitals; the values a system recorded are mono; the sentence is sans."
      >
        <Stack gap={16}>
          <Panel title="Collector certificate" heading={3}>
            <PanelStatus>
              <StatusPill tone="warn">expiring</StatusPill>
            </PanelStatus>
            <FactList layout="columns">
              <Fact label="Received" mono>
                2026-10-30T09:12:04Z
              </Fact>
              <Fact label="Key" mono>
                a4f9c21e
              </Fact>
            </FactList>
            <PanelNote>The certificate expires in 6 days. Rotate it before the next upload.</PanelNote>
          </Panel>
          <Example title="Figures" note="Values are tabular, so a column of readings does not jitter as it updates.">
            <FigureRow label="Delivery today">
              <Figure label="Events" value="1,842" />
              <Figure label="Sources" value="14" />
              <Figure label="Late" value="2" tone="warn" />
            </FigureRow>
          </Example>
        </Stack>
        <Rules>
          <li>Mono is never a sentence. A sentence a person reads is sans, even when it names an id.</li>
          <li>
            One label style per block: mono capitals above values, or sentence-case labels beside them, never both side
            by side. A form field's label stays sentence case.
          </li>
          <li>Headings are sentence case, bold only, never italic. No text is set in capitals except a mono label.</li>
        </Rules>
      </DocSection>

      <DocSection
        title="The ramp"
        lede="The steps a product screen uses. A brand page may go up to 56px for its title."
      >
        <TokenTable title="Type steps" caption="Font size tokens" rows={steps} />
      </DocSection>

      <DocSection
        title="Meta lines, keys and icons"
        lede="A meta line says when and from where, in mono, quieter than the content. A shortcut is a Kbd beside its control. An icon follows the size of the text it sits in, at one stroke."
      >
        <Example
          title="Collectors"
          note="An icon labels an action; it does not decorate. An icon-only button has a name."
        >
          <MetaLine items={["As of 09:12", "14 sources", "updates live"]} />
          <Toolbar>
            <Button variant="secondary" shortcut="/">
              <Search /> Search
            </Button>
            <Button variant="secondary">
              <Download /> Export
            </Button>
            <Button variant="ghost" iconOnly aria-label="Copy the key">
              <Copy />
            </Button>
          </Toolbar>
          <p>
            Press <Kbd>⌘K</Kbd> to open the command bar.
          </p>
        </Example>
      </DocSection>
    </Doc>
  );
}

const meta = {
  title: "Foundations/Type",
  tags: ["layer:foundation"],
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

export const Type: StoryObj = { render: () => <TypePage /> };
