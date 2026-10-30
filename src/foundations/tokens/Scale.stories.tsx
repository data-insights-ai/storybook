import type { Meta, StoryObj } from "@storybook/react-vite";
import { TickRule } from "../../components/text/TickRule";
import { Page, Rule, Rules, Section, Verdict, Verdicts } from "../guide/Guide";
import "./foundations.css";

/*
 * Foundations documented colour, type, the mark, voice, motion and the
 * Register rules — and none of the dimensional system. Spacing, radius,
 * control height and the index column existed only as prose in AGENTS.md,
 * so a designer reviewing in Storybook had to reverse-engineer them from
 * the components. This page is that missing half.
 */

const space = [
  { token: "--di-space-2", px: 2, use: "An optical nudge. A mark off a baseline." },
  { token: "--di-space-4", px: 4, use: "A mark to its word: the seal dot, a pill, a tag." },
  { token: "--di-space-6", px: 6, use: "Inside a dense control — the 28px tier." },
  { token: "--di-space-8", px: 8, use: "Inside a standard control. Between two buttons." },
  { token: "--di-space-12", px: 12, use: "A table cell. The least a text keeps from the edge of its surface." },
  { token: "--di-space-16", px: 16, use: "Panel content. Between blocks inside a panel." },
  { token: "--di-space-24", px: 24, use: "Between panels." },
  { token: "--di-space-32", px: 32, use: "Between sections of a screen." },
  { token: "--di-space-48", px: 48, use: "Between the parts of a brand page." },
  { token: "--di-space-64", px: 64, use: "Between the sections of a brand page. The brand tier starts here." },
  { token: "--di-space-96", px: 96, use: "Between the parts of an argument. A console screen never reaches it." },
];

const radius = [
  {
    token: "--di-radius-micro",
    px: 4,
    use: "Anything that takes a value: fields and search. Also the small inner corner: menu items, table cells, tooltips, tags.",
  },
  { token: "--di-radius-control", px: 6, use: "Buttons, the menu surface, the segments of a ChoiceGroup." },
  { token: "--di-radius-inset", px: 8, use: "A group inside a surface: the inset tone, a code block." },
  { token: "--di-radius-surface", px: 12, use: "Panels, record cards, dialogs, the drawer." },
  {
    token: "--di-radius-container",
    px: 12,
    use: "A frame that holds choices as cards (ChoiceGroup cards). The same corner as a surface.",
  },
  { token: "--di-radius-pill", px: 999, use: "Status pills, badges, the seal dot." },
];

const heights = [
  { token: "--di-control-h-sm", px: 28, use: 'Button size="sm", a pressable Tag, a small SearchField. 24 in compact.' },
  { token: "--di-control-h-md", px: 32, use: "The standard. Every form control unless told otherwise. 28 in compact." },
  { token: "--di-control-h-lg", px: 36, use: 'Button size="lg", the command bar input, the tab strip. 32 in compact.' },
  { token: "--di-row-h", px: 40, use: "A table or list row, via --di-table-row-height. 32 in compact." },
];

function Ramp({
  rows,
  draw,
}: {
  rows: { token: string; px: number; use: string }[];
  draw: (px: number) => React.ReactNode;
}) {
  return (
    <ul className="di-ramp">
      {rows.map((row) => (
        <li key={row.token}>
          <code>{row.token}</code>
          <b>{row.px === 999 ? "full" : `${row.px}px`}</b>
          <div className="di-ramp-figure">{draw(row.px)}</div>
          <span>{row.use}</span>
        </li>
      ))}
    </ul>
  );
}

const meta = { title: "Foundations/Scale", tags: ["layer:foundation"] } satisfies Meta;
export default meta;

/** Space, radius and control height — the three ramps a screen is built on. */
export const Dimensions: StoryObj = {
  name: "Dimensions",
  render: () => (
    <Page
      eyebrow="Scale"
      title="Eleven steps of space, six radii, four heights."
      lede="Colour and type say what the system sounds like. These three ramps are what makes a screen read as dense and deliberate rather than roomy and approximate. A component binds to a step; it does not measure its own."
    >
      <Section
        eyebrow="Space"
        title="Doubling, then widening."
        lede="2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96. Fine at the bottom, coarse at the top, because that is where the density is — a 28px control cannot be padded on a 4px grid. Tokens are named by value, so --di-space-12 is 12px and a wrong number shows up in the diff rather than hiding behind an index."
      >
        <Ramp rows={space} draw={(px) => <i className="di-ramp-bar" style={{ width: px }} />} />
        <Verdicts>
          <Verdict result="fail" note="Before: 190 of 284 spacing values sat between two steps, across 51 of 57 files.">
            The same idea — the inset of a surface — was 11px in a panel header, 12px in a notice, 13px in a drawer row,
            14px in a card, 16px in panel content and 18px in a modal. Eleven answers to one question, because there was
            no value to copy and no check to fail.
          </Verdict>
          <Verdict
            result="pass"
            note="After: every gap, padding and margin in src is a --di-space-* token or a density token. pnpm lint:tokens fails on the next one that is not."
          >
            156 values moved, most by one or two pixels. The ramp is only worth stating if something enforces it — a
            page a person has to remember is not a rule, it is a wish.
          </Verdict>
          <Verdict
            result="fail"
            note="The ramp stopped at 48. A page assembled from the package wrote calc(var(--di-space-48) * 2) in a local token to get past it."
          >
            48 is the gap between the parts of a brand page. A brand page also has to separate those parts from each
            other, and there was no step for it — so the answer lived in a stylesheet the system cannot read. 64 and 96
            close it, and they are the brand tier the way the top two type steps are: a console screen stops at 48.
          </Verdict>
        </Verdicts>
      </Section>

      <Section
        eyebrow="Radius"
        title="Moderate. Nothing is a lozenge."
        lede="The smaller the control, the tighter the corner: a field is 4px and the panel holding it is 12px, so the field reads as set into the sheet rather than floating on it. Only a pill is fully round, and only because it is a mark. No corner is hand-set any more; the lint refuses a raw radius."
      >
        <Ramp
          rows={radius}
          draw={(px) => <i className="di-ramp-corner" style={{ borderRadius: px === 999 ? 999 : px }} />}
        />
      </Section>

      <Section
        eyebrow="Height"
        title="The console runs dense. 32px is the standard."
        lede="A control is the same height whatever it is, so a toolbar is one line and not a staircase. Reach for sm beside a table and lg for a lone primary action; everything else is md. These are the comfortable values; Foundations/Density has compact, where every step shrinks and the steps between them hold. On a touch screen a field and a button are 40px in either density."
      >
        <Ramp rows={heights} draw={(px) => <i className="di-ramp-control" style={{ height: px }} />} />
      </Section>

      <Section
        eyebrow="The index column"
        title="A number only where the order is information."
        lede="--di-index-col, 38px, holds the ordinal of a row in a DataTable and in a table-shaped Loading, and the toned icon of a Notice. Numbers count where order means something: the rows of a register, the steps of a process (Steps), the rank in an AttentionList, the phases of a story."
      >
        <Rules>
          <Rule>
            A panel, a dialog, a record card or an empty Notice carries no number, and has no prop for one. A number
            that orders nothing is decoration, and the reader looks for a meaning it does not have.
          </Rule>
          <Rule>
            A side <code>Dialog</code> opened from a row names its record in its eyebrow (<code>Member · WS-01</code>),
            not by the row's ordinal.
          </Rule>
          <Rule>A failure is a status beside its title, in words, not a tinted number.</Rule>
          <Rule>
            A <code>Toast</code> carries no number either. It reports; it is not an entry.
          </Rule>
        </Rules>
      </Section>

      <Section
        eyebrow="The tick rule"
        title="One ornament, on an 8px pitch."
        lede="TickRule is the only decorative mark in the system, and it earns its place by looking like an instrument. It closes a header or a block that reports a measurement — never a block of prose."
      >
        <TickRule />
      </Section>
    </Page>
  ),
};
