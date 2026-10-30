import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Page, Section } from "../guide/Guide";
import "./foundations.css";

/*
 * Every row names the token it is set in and says where the console
 * actually uses it. A specimen that disagrees with the build is worse than
 * none.
 */

const DISPLAY = "var(--di-font-display)";
const SANS = "var(--di-font-ui)";
const MONO = "var(--di-font-code)";
const TIGHT = "var(--di-tracking-tight)";

type Row = { token: string; note: string; sample: string; style: CSSProperties };

const display: Row[] = [
  {
    token: "--di-font-size-1000 · 56 · 700",
    note: "Foundations page title, a hero figure at its widest",
    sample: "Provable AI.",
    style: {
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: "var(--di-font-size-1000)",
      letterSpacing: TIGHT,
      lineHeight: 1.05,
    },
  },
  {
    token: "--di-font-size-700 · 28 · 700",
    note: "PageHeader: the page's name. Figure value",
    sample: "Production",
    style: {
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: "var(--di-font-size-700)",
      letterSpacing: TIGHT,
      lineHeight: 1.1,
    },
  },
  {
    token: "--di-font-size-600 · 20 · 700",
    note: "SectionTitle, AttentionList heading, Hero title",
    sample: "3 things need you",
    style: { fontFamily: DISPLAY, fontWeight: 700, fontSize: "var(--di-font-size-600)", lineHeight: 1.2 },
  },
];

const prose: Row[] = [
  {
    token: "--di-font-size-550 · 18 · 400",
    note: "Brand page lede — the band's one interpolated step",
    sample: "Every answer is grounded in a temporal knowledge graph.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-550)", lineHeight: 1.55 },
  },
  {
    token: "--di-font-size-500 · 16 · 600",
    note: "A block's title: Panel, AttentionItem",
    sample: "Two sources stopped delivering",
    style: { fontFamily: SANS, fontWeight: 600, fontSize: "var(--di-font-size-500)", lineHeight: 1.35 },
  },
  {
    token: "--di-font-size-400 · 14 · 400",
    note: "The console body — base.css",
    sample: "The source was paused after four consecutive rate limits.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-400)", lineHeight: 1.5 },
  },
  {
    token: "--di-font-size-400 · 14 · 500",
    note: "Control labels",
    sample: "Add entry",
    style: { fontFamily: SANS, fontWeight: 500, fontSize: "var(--di-font-size-400)" },
  },
  {
    token: "--di-font-size-300 · 12 · 400",
    note: "Field hints, a panel's note",
    sample: "Entries already sealed stay on record.",
    style: { fontFamily: SANS, fontSize: "var(--di-font-size-300)", lineHeight: 1.35 },
  },
];

const machine: Row[] = [
  {
    token: "--di-mono-label-* · 11 · 500 · 0.1em",
    note: "The label above a value: a figure, a table column, a navigation group",
    sample: "TIME TO ACKNOWLEDGE",
    style: {
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: "var(--di-font-size-200)",
      letterSpacing: "var(--di-tracking-label)",
      textTransform: "uppercase",
      color: "var(--di-text-muted)",
    },
  },
  {
    token: "--di-meta-* · 12 · 400",
    note: "MetaLine: as of when, from where",
    sample: "As of 12 Oct, 10:00 · 14 sources · updates live",
    style: { fontFamily: MONO, fontSize: "var(--di-font-size-300)", color: "var(--di-text-subtle)" },
  },
  {
    token: "--di-font-size-400 · 14 · 400",
    note: "Identifiers, hashes, timestamps",
    sample: "a4f9c21e · 2026-09-18T09:12:04Z",
    style: { fontFamily: MONO, fontSize: "var(--di-font-size-400)", fontVariantNumeric: "tabular-nums" },
  },
  {
    token: "--di-font-size-100 · 10 · 500",
    note: "Kbd, tile ordinal",
    sample: "⌘K",
    style: { fontFamily: MONO, fontWeight: 500, fontSize: "var(--di-font-size-100)" },
  },
];

function Rows({ rows }: { rows: Row[] }) {
  return (
    <div className="di-type-sample">
      {rows.map((row) => (
        <div key={row.token + row.sample} className="di-type-row">
          <div className="di-type-meta">
            {row.token}
            <span>{row.note}</span>
          </div>
          <div style={row.style}>{row.sample}</div>
        </div>
      ))}
    </div>
  );
}

const meta = { title: "Foundations/Type", tags: ["layer:foundation"] } satisfies Meta;
export default meta;

/** The scale, with the token each step is set in and where it is used. */
export const ScaleStory: StoryObj = {
  name: "Scale",
  render: () => (
    <Page
      eyebrow="Type"
      title="Three families, three jobs."
      lede="Space Grotesk names and counts: a page's name, a figure, a section head. IBM Plex Sans is what a person reads, at 14px. IBM Plex Mono is what a machine wrote, and the label above a value, so the label reads as a different kind of text than the value it names."
    >
      <Section
        eyebrow="Display"
        title="Space Grotesk."
        lede="Three steps on a console: the page's name, a figure, a section head. Bold only. The top of the ramp is a brand page's, and the one hero figure of a view."
      >
        <Rows rows={display} />
      </Section>
      <Section
        eyebrow="Prose"
        title="IBM Plex Sans."
        lede="The body is 14px: a briefing is read, not only scanned. -550 is the ladder's one interpolated step, for a brand page's lede."
      >
        <Rows rows={prose} />
      </Section>
      <Section
        eyebrow="Record"
        title="IBM Plex Mono."
        lede="Figures are tabular, so a column of readings does not jitter as it updates. Labels above values run in mono capitals; a field's label stays prose in sentence case."
      >
        <Rows rows={machine} />
      </Section>
    </Page>
  ),
};

/** The same sentence, in each track, meaning two different things. */
export const TrackStory: StoryObj = {
  name: "Track",
  render: () => (
    <Page
      eyebrow="Type"
      title="The mono track is a claim about provenance."
      lede="If a person wrote it, it is IBM Plex Sans. If the system recorded it, it is IBM Plex Mono — and it is then something that can be cited."
    >
      <Section eyebrow="Side by side" title="One reads as an account. The other reads as a record.">
        <div className="di-type-sample">
          <div className="di-type-row">
            <div className="di-type-meta">
              Prose<span>a person wrote it</span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: "var(--di-font-size-400)" }}>
              The source was paused after four consecutive rate limits.
            </div>
          </div>
          <div className="di-type-row">
            <div className="di-type-meta">
              Record<span>the system wrote it</span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: "var(--di-font-size-400)", fontVariantNumeric: "tabular-nums" }}>
              feed.example.io · paused 2026-09-23T08:47:11Z · 429 ×4
            </div>
          </div>
          <div className="di-type-row">
            <div className="di-type-meta">
              Figures<span>tabular, so they do not jitter</span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: "var(--di-font-size-500)",
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>1,842</span>
              <span>1,109</span>
              <span>744</span>
              <span>487</span>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  ),
};
