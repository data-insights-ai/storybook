import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, Rule, Rules, Section, Verdict, Verdicts } from "./guide/Guide";
import "./foundations.css";

/*
 * Foundations documented colour, type, the mark, voice, motion and the
 * Register rules — and none of the dimensional system. Spacing, radius,
 * control height and the index column existed only as prose in AGENTS.md,
 * so a designer reviewing in Storybook had to reverse-engineer them from
 * the components. This page is that missing half.
 */

const space = [
  { token: "--di-space-1", px: 4, use: "Icon to label. A mark to its word." },
  { token: "--di-space-2", px: 8, use: "Inside a control. Between two buttons." },
  { token: "--di-space-3", px: 12, use: "A panel's padding. Rows in a list." },
  { token: "--di-space-4", px: 16, use: "Between blocks inside a panel." },
  { token: "--di-space-5", px: 24, use: "Between panels." },
  { token: "--di-space-6", px: 32, use: "Between sections of a screen." },
  { token: "--di-space-7", px: 48, use: "Between the parts of a brand page." },
];

const radius = [
  { token: "--di-radius-micro", px: 4, use: "Fields and search. Also the small inner corner: menu items, table cells, tooltips, chips." },
  { token: "--di-radius-control", px: 6, use: "Buttons, chips, the menu surface, the segmented control." },
  { token: "--di-radius-surface", px: 8, use: "Panels, cards, modals, the drawer." },
  { token: "--di-radius-container", px: 12, use: "The console frame in AppShell. One use, and nothing else needs it yet." },
  { token: "--di-radius-pill", px: 999, use: "Status pills, chips, the seal dot." },
];

const heights = [
  { token: "--di-h-dense", px: 28, use: "Button size=\"dense\", Chip, a menu item, a dense SearchField." },
  { token: "--di-h-ctl", px: 32, use: "The standard. Every form control unless told otherwise." },
  { token: "--di-h-comfort", px: 36, use: "Button size=\"comfort\", the command bar input, the tab strip." },
  { token: "--di-h-row", px: 40, use: "A table row, via --di-table-row-height. Its only use." },
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

const meta = { title: "Foundations/Scale" } satisfies Meta;
export default meta;

/** Space, radius and control height — the three ramps a screen is built on. */
export const Dimensions: StoryObj = {
  name: "Dimensions",
  render: () => (
    <Page
      eyebrow="Scale"
      title="Seven steps of space, four radii, four heights."
      lede="Colour and type say what the system sounds like. These three ramps are what makes a screen read as dense and deliberate rather than roomy and approximate. A component binds to a step; it does not measure its own."
    >
      <Section
        eyebrow="Space"
        title="Doubling, then widening."
        lede="4, 8, 12, 16, 24, 32, 48. A gap, a padding or a margin should land on one of them; a value between two steps is a decision nobody made. New work holds to this. The components do not yet — see the note below, which is measured rather than asserted."
      >
        <Ramp
          rows={space}
          draw={(px) => <i className="di-ramp-bar" style={{ width: px }} />}
        />
        <Verdicts>
          <Verdict result="fail" note="Measured across src/components/*.css. 190 of 284 spacing values sit between two steps, in 51 of 57 files.">
            The components are on this scale about a third of the time. The same idea — the inset of
            a surface — is 11px in a panel header, 12px in a notice, 13px in a drawer row, 14px in a
            card, 16px in panel content and 18px in a modal.
          </Verdict>
          <Verdict result="pass" note="What the number is for.">
            It is stated because a foundation that quietly disagreed with the build would be the
            more expensive kind of wrong. Retrofitting moves roughly 190 declarations and shifts the
            density of every screen, so it is a decision to take deliberately, not a tidy-up.
          </Verdict>
        </Verdicts>
      </Section>

      <Section
        eyebrow="Radius"
        title="Moderate. Nothing is a lozenge."
        lede="The smaller the control, the tighter the corner — a field is 4px and the panel holding it is 8px, so the field reads as set into the sheet rather than floating on it. Only a pill is fully round, and only because it is a mark. Four corners are still hand-set and off the ramp: 10px in AppShell, Channel and Stage, and 3px on the checkbox."
      >
        <Ramp
          rows={radius}
          draw={(px) => (
            <i
              className="di-ramp-corner"
              style={{ borderRadius: px === 999 ? 999 : px }}
            />
          )}
        />
      </Section>

      <Section
        eyebrow="Height"
        title="The console runs dense. 32px is the standard."
        lede="A control is the same height whatever it is, so a toolbar is one line and not a staircase. Reach for 28 beside a table and 36 for a lone primary action; everything else is 32."
      >
        <Ramp
          rows={heights}
          draw={(px) => <i className="di-ramp-control" style={{ height: px }} />}
        />
      </Section>

      <Section
        eyebrow="The index column"
        title="38 pixels that cost real space."
        lede="`--di-index-col` is the system's fingerprint: the column down the left of `Panel`, `DataTable`, `Drawer`, `Notice`, `EmptyState`, `Modal`, `SignIn`, `StatTile` and `SkeletonTable`, holding an ordinal, a letter or a § mark."
      >
        <Rules>
          <Rule>It is what turns a card into an entry, and gives a row a handle an operator can say out loud.</Rule>
          <Rule>A drawer keeps the ordinal of the row it opened from, so the row and its detail are visibly the same object.</Rule>
          <Rule>A failure keeps its ordinal too, tinted. A failed run is still something the register recorded.</Rule>
          <Rule>`Panel` and `StatTile` can drop to `--di-index-col-sm`, 26px, where the block is too short to give up the full width.</Rule>
          <Rule>`Card`, `Toast`, `Stage`, `Session` and `Metric` carry no index. They report; they are not entries.</Rule>
        </Rules>
      </Section>

      <Section
        eyebrow="The tick rule"
        title="One ornament, on an 8px pitch."
        lede="`TickRule` is the only decorative mark in the system, and it earns its place by looking like an instrument. It closes a header or a block that reports a measurement — never a block of prose."
      >
        <div className="di-tick-rule" />
      </Section>
    </Page>
  ),
};
